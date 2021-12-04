# Setting up Wireguard on an EdgeRouter 4

## Download & Install
First we need to install the .deb package for Wireguard. You can find it in the releases of the [official repository](https://github.com/WireGuard/wireguard-vyatta-ubnt) (copy the link address to get the right download location).

Download and install with:
```bash
curl -OL https://github.com/WireGuard/wireguard-vyatta-ubnt/releases/download/1.0.20210606-2/e300-v2-v1.0.20210606-v1.0.20210914.deb

sudo dpkg -i e300-v2-v1.0.20210606-v1.0.20210914.deb
```

## Configuration
Next, configure the `wg0` interface:
```bash
# Generate key pair
wg genkey | tee /config/auth/wg.key | wg pubkey >  wg.public

configure

# Configure interface
set interfaces wireguard wg0 address 10.0.0.1/24
set interfaces wireguard wg0 listen-port 51820
set interfaces wireguard wg0 route-allowed-ips true

# Configure peer
set interfaces wireguard wg0 peer GIPWDet2eswjz1JphYFb51sh6I+CwvzOoVyD7z7kZVc= endpoint <public_ip>:51820
set interfaces wireguard wg0 peer GIPWDet2eswjz1JphYFb51sh6I+CwvzOoVyD7z7kZVc= allowed-ips 10.0.0.2/32

set interfaces wireguard wg0 private-key /config/auth/wg.key

# Configure firewall
set firewall name WAN_LOCAL rule 20 action accept
set firewall name WAN_LOCAL rule 20 protocol udp
set firewall name WAN_LOCAL rule 20 description 'WireGuard'
set firewall name WAN_LOCAL rule 20 destination port 51820

commit
save
exit
```

You have now succesfully installed Wireguard.