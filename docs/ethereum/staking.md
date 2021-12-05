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
only require 16 ETH to get started, and since that's all I have right now, this is what this document covers. This guide assumes
a Linux machine, and I'm using Ubuntu 20.04 LTS.

## Execution Node: Erigon
For our execution node, we'll go with [Erigon](https://github.com/ledgerwatch/erigon). Erigon is a modular Ethereum archive node
with a very efficient initial sync that runs in stages, and a relatively small, flat key-value database store. Erigon is 
written in Go, and there are some other clients on the way that follow this new architecture, e.g. 
[Silkworm (C++)](https://github.com/torquem-ch/silkworm) and [Akula (Rust)](https://github.com/akula-bft/akula).

Archive nodes store and validate the complete Ethereum chain, right from block 0. This can be interesting if you want 
to inspect historical events, and do historical transaction tracing. There are some cool projects that build on these
properties of Erigon:
* [Trueblocks](https://trueblocks.io/), a chain indexer to query the Ethereum blockchain
* [Otterscan](https://github.com/wmitsuda/otterscan), a block explorer like Etherscan, but local (and faster)

Another fact about Erigon is that it is built in a modular way - you can run the RPC API, the transaction pool, or even the 
p2p stack as different processes that communicate back to the main erigon process over gRPC. 

The modular architecture brings with it some great benefits, including the ability to run multiple rpcdaemons at once, or run
the rpcdaemon on another machine. We'll just do it because there are some RPC methods that require a separate rpcdaemon.
You can find more info on their [Github Wiki](https://github.com/ledgerwatch/erigon/wiki).

### Statistics
Syncing an Erigon archive node took around 76 hours in total on the following machine:
* CPU: AMD Ryzen 9 3900x (12 cores, 4.6 GHz)
* SSD: logical volume of 1 2TB Corsair Force MP600 and one 2TB Seagate Ironwolf 510
* RAM: 64GB of DDR4 (Corsair Vengeance, 2x 32 GB modules)

The sync consumed 700 GB of network traffic, and the total database size is 1.6 TB. If you run
a geth node in archive mode, you'll need more than 6 TB of disk space.

### Prerequisites
* [Install Go](https://go.dev/doc/install)

### Installation
```bash
git clone --recurse-submodules -j8 https://github.com/ledgerwatch/erigon.git
cd erigon
git checkout stable
make erigon
```

We'll run the RPC API, `rpcdaemon` in Erigon lingo, as a separate process, so we have to build that too:
```bash
make rpcdaemon
```

After building, we'll move the erigon directory to `/srv`:
```bash
sudo mv erigon /srv/
```
This is the location where our systemd services will start the processes from.
## Consensus Node: Lighthouse
As a consensus node, we're going to install Lighthouse, built with Rust.

### Prerequisites

* [Install Rust](https://www.rust-lang.org/tools/install)

### Installation
```bash
git clone https://github.com/sigp/lighthouse.git
cd lighthouse
git checkout stable
make

# Move to system directory
sudo mv lighthouse /srv/
```

To update:
```bash
cd /srv/lighthouse
git fetch
git checkout ${VERSION}
make
```

## Rocketpool
> Rocket Pool is the base layer protocol for decentralised and trustless ETH2 staking.

With Rocketpool, node operators can collaborate with stakers to create validators. A node operator (us) runs the infrastructure
(execution, beacon node and validator), and stakes 16 ETH of his own together with some **RPL** tokens (10% of staked ETH) as collateral for slashing and performance insurance.
Stakers can more easily participate because they only require a small amount of ETH to get started. Essentially, Rocketpool splits the difference between those who have the technical skills to run and maintain a node and those who lack the financial capacity to own 32 ETH.

As a node operator, you'll also get more ROI in the form of the slashing insurance premiums (RPL) and a commission rate (ETH).
## Setup
We're going to run the execution and consensus clients as [systemd](https://en.wikipedia.org/wiki/Systemd) services, 
each with their own service accounts. The service accounts will have limited access to the rest of the system,
so if one of the clients is compromised, the damage will be contained. The Rocketpool smart node stack will run in Docker containers.
This is the [Hybrid Rocket Pool Node](https://docs.rocketpool.net/guides/node/hybrid.html) configuration.

:::info Storage
The disks you will use as storage should be SSDs, HDD won't cut it. I've mounted some NVMe drives as logical volumes,
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
:::caution Listening addresses
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
:::note Docker installation
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
:::caution Port forwarding
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

### Setting up a Wallet
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
:::warning
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
This is where things get interesting, and potentially dangerous. Make sure you're ready to stake 16 or 32 ETH, as well as a
non-trivial amount of RPL. Also make sure your secrets are secret, and be diligent about it.

#### Staking RPL
The first step in setting up a validator is to stake your RPL. This should be at least 10% of the value of your ETH, and
the more you stake, the more you earn (capped at 150% of your ETH value). 
:::info
This stake counts for your entire node, so if
you want to run multiple minipools, this is possible without buying and staking more RPL.
:::

Start staking with the following command:
```bash
rocketpool node stake-rpl
```
This will prompt you for the amount you want to stake, so you don't have to calculate it yourself:
```
Please choose an amount of RPL to stake:
1: The minimum minipool stake amount (284.477473 RPL)?
2: The maximum effective minipool stake amount (4267.162095 RPL)?
3: Your entire RPL balance (1440.000000 RPL)?
4: A custom amount
```
On confirmation, you'll have to allow 2 transactions. Once these are confirmed, you can check your staked balance:
```bash
rocketpool node status

The node has a total stake of 11763.477483 RPL and an effective stake of 11763.477483 RPL, allowing it to run 41 minipool(s) in total.
This is currently a 10.88% collateral ratio.
The node must keep at least 10810.143971 RPL staked to collateralize its minipools and claim RPL rewards.
```
Make sure your collateral ratio is above 10%, or you won't be able to collect any RPL staking rewards.
:::warning
Your nodes should be synced before moving on to the next step, or you will lose rewards.
:::

#### Staking ETH and Creating a Minipool
We're now ready to finally stake our ETH and put our node up to become a validator:
```bash
rocketpool node deposit
```
You will be prompted to deposit either 16 or 32 ETH, we'll be going with 16. This will put us in the minipool queue,
where we wait for 16 ETH to become available from stakers in the rETH staking pool. Once we hit the front of the queue
and the ETH is available, it will be combined with our own 16 ETH to create a minipool and deposit the 32 ETH to the
Beacon Chain deposit contract. Thus our validator is born!

First we have to confirm the transaction though. You will have to set a commission slippage rate, but chances are the commission
rate is 5%, which is the lowest it can go. So just accept the suggested slippage rate. If this is not the case, you can read more 
about it [here](https://docs.rocketpool.net/guides/node/create-validator.html#depositing-eth-and-creating-a-minipool).
:::caution
This is an expensive transaction, and the total cost in ETH will be displayed in the prompt. Make sure you're okay with the cost
before confirming.
:::

#### Confirming Minipool Creation
Confirming the succesful creation of the minipool can be done with the following command:
```bash
rocketpool minipool status
```
Your minipool will go through a couple stages before being finalized. First, it will enter the `initialized` stage,
which means your minipool is currently in the queue waiting to be assigned 16 ETH from the network. You can check your 
position in the queue [here](https://www.rp-metrics-dashboard.com/dashboard/MAINNET), where you can enter your node address.

Once the ETH is received and 32 of it is sent to the Beacon Chain contract, you will enter the `prelaunch` state. This is currently
a period of 12 hours wherein all kinds of checks are performed. After this period, your validator will be activated and the
minipool will enter the `staking` stage. You can also follow this process on [beaconcha.in](https://beaconcha.in/) (find
your validator public key by looking up your node minipool creation transaction on etherscan).

:::info
If at any time during the process something didn't work as expected, I suggest you to check your logs with `rocketpool service logs`.
Also look at the logs of your Erigon and Lighthouse, as something might be wrong in that part of the stack as well.
:::

If you got here, you're now officially a validator on the Ethereum network, congratulations! There are a couple ways to check
your rewards:
* You can look at beaconcha.in, but this will only show rewards for the whole validator, or
* You can check out the Grafana dashboard that's running on port `3100` (if you set it up), which will show you all kinds of cool metrics.
Read more about them [here](https://docs.rocketpool.net/guides/node/grafana.html#overview-of-the-rocket-pool-metrics-stack).
I highly recommend setting this up!

## Sources
**\[1\]** [Rocketpool Docs](https://docs.rocketpool.net)

**\[2\]** [Rocketpool CLI Reference](https://docs.rocketpool.net/guides/node/cli-intro.html)

**\[3\]** [Rocketpool staking protocol part 3](https://medium.com/rocket-pool/rocket-pool-staking-protocol-part-3-3029afb57d4c)