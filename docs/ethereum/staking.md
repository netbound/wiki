---
id: staking
title: Staking on Ethereum with Rocketpool
tags:
  - ethereum
  - erigon
  - lighthouse
sidebar_position: 1
---

# Staking on Ethereum with Rocketpool

To participate as a validator in Ethereum consensus, we have to stake 32 ETH, which is a lot. With Rocketpool, node operators
only require 16 ETH to get started, and since that's all I have right now, this is the way we'll do it.

## Execution Node

## Consensus Node
As a consensus node, we're going to install Lighthouse, built with Rust.

### Prerequisites

* [Install Rust](https://www.rust-lang.org/tools/install)

### Installation

We're going to build from source:

```bash
git clone https://github.com/sigp/lighthouse.git
cd lighthouse
git checkout stable
make
```

To update:
```bash
cd lighthouse
git fetch
git checkout ${VERSION}
make
```

Lighthouse uses port 9000 for both TCP and UDP:
```bash
sudo ufw allow 9000
```

### Running

As the execution client we use [Erigon](https://github.com/ledgerwatch/erigon). We can now run the lighthouse because node:
```bash
lighthouse --datadir /mnt/evo/lighthouse/ --network mainnet bn --staking
```
By default, Lighthouse will look for the Eth1 client RPC at **http://localhost:8545**.


## Rocketpool

> Rocket Pool is the base layer protocol for decentralised and trustless ETH2 staking.

With Rocketpool, node operators can collaborate with stakers to create validators. A node operator (us) runs the infrastructure
(execution + beacon node), and stakes 16 ETH of his own together with some **RPL** tokens (10% of staked ETH) as collateral for slashing insurance.
Stakers can more easily participate because they only require a small amount of ETH to get started. Essentially, Rocketpool splits the difference between those who have the technical skills to run and maintain a node and those who lack the financial capacity to own 32 ETH.

As a node operator, you'll also get more ROI in the form of the slashing insurance premiums (RPL) and a commission rate (ETH).

## Setup
We're going to run the execution and consensus clients as services following [this guide](https://docs.rocketpool.net/guides/node/native.html), each with their own service accounts. The service accounts will have limited access to the rest of the system,
so if one of the clients is compromised, the damage will be contained. The Rocketpool smart node will run in a Docker container.
This is the [Hybrid Rocket Pool Node](https://docs.rocketpool.net/guides/node/hybrid.html) configuration.

:::info Storage
The disks you will use as storage should be SSDs, HDD won't cut it. I've mounted some external drives as logical volumes,
so that I can easily increase capacity in the future. Stats:
* Erigon drive: 4 TB (right now, state is about 1.6 TB) NVMe
* Lighthouse drive: 1 TB NVMe
:::

### Setting up the services
Let's start by creating the service accounts (without login) and service groups:
```bash
# -r is for system account, -s specifies shell
sudo useradd -r -s /sbin/nologin erigon
sudo useradd -r -s /sbin/nologin lighthouse

# service group
sudo groupadd ethereum
```
Next, change the ownership of the client directories:
```bash
sudo chown -R erigon:ethereum /srv/erigon
sudo chown -R lighthouse:ethereum /srv/lighthouse
```
We have to be part of the `ethereum` group with our main account to have write access
to the directories (for updating):
```bash
sudo usermod -aG ethereum $USER
```

#### Systemd service files
We'll need the following systemd services:
* Erigon execution client
* Rpcdaemon for Erigon
* Lighthouse beacon node

```service title="/etc/systemd/system/erigon.service"
[Unit]
Description=Erigon
After=network.target

[Service]
Type=simple
User=erigon
Restart=always
RestartSec=5
ExecStart=/srv/erigon/build/bin/erigon --datadir /mnt/eth-archive --maxpeers 100

[Install]
WantedBy=multi-user.target
```
```text title="/etc/systemd/system/rpcdaemon.service"
[Unit]
Description=Rpcdaemon
After=network.target erigon.service
Wants=erigon.service
PartOf=erigon.service

[Service]
Type=simple
User=erigon
Restart=always
RestartSec=5
ExecStart=/srv/erigon/build/bin/rpcdaemon --datadir /mnt/eth-archive --ws --http.addr 0.0.0.0 --http.api eth,net,trace,erigon,web3

[Install]
WantedBy=multi-user.target
```
```service title="/etc/systemd/system/lh-bn.service"
[Unit]
Description=Lighthouse Beacon Node
After=network.target rpcdaemon.service
Wants=rpcdaemon.service
PartOf=rpcdaemon.service

[Service]
Type=simple
User=lighthouse
Restart=always
RestartSec=5
ExecStart=/srv/lighthouse/target/release/lighthouse beacon --network mainnet --datadir /mnt/evo/lighthouse --port 9001 --discovery-port 9001 --eth1 --eth1-endpoints http://localhost:8545 --http --http-address 0.0.0.0 --http-port 5052 --eth1-blocks-per-log-query 150 --disable-upnp

[Install]
WantedBy=multi-user.target
```
:::caution
The HTTP addresses on rpcdaemon and Lighthouse were changed to 0.0.0.0, because the Rocketpool node, which runs in a Docker container,
otherwise can't reach them. But beware, these APIs are now listening on public interfaces, so make sure your firewall is running.
:::

### Installing Rocketpool
#### Installing the CLI
We download the CLI following [this Rocketpool guide](https://docs.rocketpool.net/guides/node/docker.html#downloading-the-rocket-pool-cli):
```bash
wget https://github.com/rocket-pool/smartnode-install/releases/latest/download/rocketpool-cli-linux-amd64 -O ./rocketpool
# Mark as executable and move to somewhere in $PATH
chmod +x ./rocketpool && sudo mv ./rocketpool /usr/local/bin
```
Test running it with the `--version` flag, which should output something like this:
```
$ rocketpool --version

rocketpool version 1.1.0
```
#### Installing the Smartnode Stack
We can install the Smartnode Stack for mainnet like this:
```bash
rocketpool service install
```
Next, add yourself to the `docker` group to use Docker without root privileges:
```bash
sudo usermod -aG docker $USER
```
You will have to restart your SSH session for these changes to take effect.
:::note
This will download Docker and docker-compose for you, if you already have these installed, run:
```bash
rocketpool service install -d 
```
This will tell rocketpool to skip the dependencies.
:::

#### Basic Configuration
Run the following command:
```bash
rocketpool service config
```
This will start an interactive process to help with the configuration.
For our ETH1 client, even though we're using Erigon, you can select Geth (1) and leave all the default options.
We will later modify these.

For the ETH2 configuration, make sure to select Lighthouse. This is important, since the validator node
is part of the Smartnode Stack and needs to be the same client as our Beacon Node. The default settings will do, but you can
add your own custom Graffiti! This will be included on every block your validator produces, which is pretty cool.

As we've seen, the Smartnode Stack runs with docker-compose. We'll need to change the original compose file:
```yaml title="~/.rocketpool/docker-compose.yml"
version: "3.4"
services:
  eth1:
    image: ${ETH1_IMAGE}
    ...
  eth2:
    image: ${ETH2_IMAGE}
    ...
    depends_on:
      - eth1
  validator:
    image: ${VALIDATOR_IMAGE}
    ...
    depends_on:
      - eth2
  api:
    image: ${SMARTNODE_IMAGE}
    ...
    depends_on:
      - eth1
    entrypoint: /bin/sleep
    command: "infinity"
  node:
    image: ${SMARTNODE_IMAGE}
    ...
    depends_on:
      - eth1
      - eth2
  watchtower:
    image: ${SMARTNODE_IMAGE}
    ...
    depends_on:
      - eth1
      - eth2
```
Delete both the `eth1` and `eth2` sections of the configuration, and if they are in another services' `depends_on` section, 
remove them there too.

#### Creating Docker Networks
Right now, we're going to start and stop the smartnode stack. It won't work yet, but it will create the necessary Docker networks, which
we need for later configuration.

```bash
rocketpool service start
rocketpool service stop
```

This will have created a Docker network `rocketpool_net`. Find the subnet with:
```bash
docker inspect rocketpool_net | jq .[0].IPAM.Config[0].Subnet

# Example:
SUBNET="172.18.0.0/16"
```

We can now configure the firewall.

### Firewall (using UFW)
We need to open the correct ports on our machine:
```bash
# Erigon
sudo ufw allow 30303 comment "Erigon eth65 p2p"
sudo ufw allow 30304 comment "Erigon eth66 p2p"

# where $SUBNET is the Docker subnet you noted before
sudo ufw allow from $SUBNET to any port 8545 comment "Rocketpool to Erigon"
# Lighthouse
sudo ufw allow 9001 comment "Lighthouse p2p"

sudo ufw allow from $SUBNET to any port 5052 comment "Rocketpool to Lighthouse beacon node"
```
Right now the APIs are only reacheable from inside the Docker containers. If you want to reach them from other machines on your network, 
configure the firewall accordingly.
:::caution
If your machine is behind a router or firewall, make sure to configure port forwarding. This is important for maintaining good
connectivity and allowing other peers to discover you.
:::

### Configuring Rocketpool
We've already done some basic configuration in `~/.rocketpool/docker-compose.yml`, but we're not done yet.
The next file we need to configure is `~/.rocketpool/config.yml`:

```yaml title="~/.rocketpool/config.yml"
rocketpool:
  ...
smartnode:
  ...
chains:
  eth1:
    provider: http://eth1:8545
    wsProvider: ws://eth1:8546
    ...
  eth2:
    provider: http://eth2:5052
    ...
```

The hosts that are filled in by default (`eth1`, `eth2`) are normally resolved inside of the Docker network.
Since we're not running these services as Docker containers, we'll need to modify them. Replace
all the providers with the gateway IP of `$SUBNET` (if your SUBNET was `172.18.0.0/16`, your http provider will
be `http://172.18.0.1:8545`). Your ws provider will be `ws://172.18.0.1:8545`, since Erigon uses the same ports
for both HTTP and WebSockets. Do the same for the `eth2` provider.

This networking setup will work since we configured UFW to accept connections coming from the Docker network.

## Running
### Starting the Rocketpool Service
We have done enough configuration for now, and can finally start the service. Use this command:
```bash
rocketpool service start

Creating network "rocketpool_net" with the default driver
Creating rocketpool_api  ... 
Creating rocketpool_api  ... done
Creating rocketpool_watchtower ... 
Creating rocketpool_node       ... 
Creating rocketpool_validator  ... 
Creating rocketpool_validator  ... done
Creating rocketpool_node       ... done
Creating rocketpool_watchtower ... done
```

I have included the output, and this is more or less what your output should look like as well. 

If you need to stop the service to do some system maintenance or upgrade the rocketpool stack, use:
```bash
rocketpool service stop

Are you sure you want to pause the Rocket Pool service? Any staking minipools will be penalized! [y/n]
y

Stopping rocketpool_node       ... 
Stopping rocketpool_validator  ... 
Stopping rocketpool_watchtower ... 
Stopping rocketpool_api        ... 
Stopping rocketpool_validator  ... done
Stopping rocketpool_node       ... done
Stopping rocketpool_watchtower ... done
Stopping rocketpool_api        ... done
```

#### Checking the Services
We can check the service version and networks with `rocketpool service version`.

Checking if all the containers are running can be done with `docker ps`:
```bash
docker ps

CONTAINER ID   IMAGE                         COMMAND                  CREATED       STATUS      PORTS                                                 NAMES
cc23bb9f1f7c   sigp/lighthouse:v2.0.1        "sh /setup/start-val…"   2 days ago    Up 2 days                                                         rocketpool_validator
0cbe6a5f4997   rocketpool/smartnode:v1.1.0   "/go/bin/rocketpool …"   2 days ago    Up 2 days                                                         rocketpool_node
a4223e20252e   rocketpool/smartnode:v1.1.0   "/go/bin/rocketpool …"   2 days ago    Up 2 days                                                         rocketpool_watchtower
681f8a9744c1   rocketpool/smartnode:v1.1.0   "/bin/sleep infinity"    2 days ago    Up 2 days                                                         rocketpool_api
b1dc152f1391   grafana/grafana:8.1.1         "/run.sh"                8 weeks ago   Up 2 days   3000/tcp, 0.0.0.0:3100->3100/tcp, :::3100->3100/tcp   rocketpool_grafana
fcfa50d3f3bf   prom/node-exporter:v1.2.2     "/bin/node_exporter …"   8 weeks ago   Up 2 days                                                         rocketpool_exporter
e274309e596a   prom/prometheus:v2.28.1       "/bin/prometheus --w…"   8 weeks ago   Up 2 days   9090/tcp                                              rocketpool_prometheus
```
:::info
This might look different if you didn't configure for analytics during the setup.
:::

Further logs can be obtained with `rocketpool service logs` for all logs, or `rocketpool service logs <service>`, to get the logs
for a specific service (`validator` or `node` for example).

### Setting up Wallet
Now that all the services are running, we need to set up an ETH1 wallet for the node. This wallet will
* Hold ETH to pay for various actions on the network (creating a new minipool, staking your RPL)
* Hold the ETH that you're going to send to your minipool to start staking
* Hold the RPL that you're going to stake

We're going to use the `rocketpool` cli to create this wallet:
```
rocketpool wallet init
```
This will prompt you for a password to protect your private key and give you back a 24-word mnemonic that
is your recovery phrase. Your password will be written to `~/.rocketpool/data/password` in CLEARTEXT, so make sure
there's no one else on your system. Your wallet private key is at `~/.rocketpool/data/wallet`.
:::danger
Please write down your recovery phrase, but KEEP IT SAFE. This phrase can be used to import your wallet
and all validators attached to a new machine, and anyone that has this phrase has full control over your
private key.
:::

### Loading up the Funds
Before we can create a minipool, we need 16 ETH, extra ETH for gas fees, and some RPL in our node wallet.
The RPL value should be at least 10% of the value of your ETH in USD. You can read more about the purpose of 
RPL in **[[3]](#sources)**.

### Registering the Node
Once the funds are in the wallet, we can register our node with the Rocketpool network:
```bash
rocketpool node register
```
This will prompt you for your timezone, as well as sending a transaction. Make sure the gas price is not ridiculously high.
You can now check your RPL and ETH balances:
```bash
rocketpool node status
```
By default, all your RPL rewards, as well as your staked ETH and RPL will be sent to your wallet address when claiming the
rewards or exiting your validator. If you want to change this, follow [this guide](https://docs.rocketpool.net/guides/node/prepare-node.html#setting-your-withdrawal-address).

### Setting up a Minipool

## Sources
**\[1\]** [Rocketpool Docs](https://docs.rocketpool.net)

**\[2\]** [Rocketpool CLI Reference](https://docs.rocketpool.net/guides/node/cli-intro.html)

**\[3\]** [Rocketpool staking protocol part 3](https://medium.com/rocket-pool/rocket-pool-staking-protocol-part-3-3029afb57d4c)