"use strict";(self.webpackChunkalexandria=self.webpackChunkalexandria||[]).push([[461],{1177:function(e,t,n){n.r(t),n.d(t,{frontMatter:function(){return r},contentTitle:function(){return l},metadata:function(){return c},toc:function(){return d},default:function(){return p}});var o=n(7462),a=n(3366),i=(n(7294),n(3905)),s=["components"],r={sidebar_position:6},l="Staking on Ethereum with Rocketpool",c={unversionedId:"ethereum/staking",id:"ethereum/staking",isDocsHomePage:!1,title:"Staking on Ethereum with Rocketpool",description:"To participate as a validator in Ethereum consensus, we have to stake 32 ETH, which is a lot. With Rocketpool, node operators",source:"@site/docs/ethereum/staking.md",sourceDirName:"ethereum",slug:"/ethereum/staking",permalink:"/docs/ethereum/staking",editUrl:"https://github.com/facebook/docusaurus/edit/main/website/docs/ethereum/staking.md",tags:[],version:"current",sidebarPosition:6,frontMatter:{sidebar_position:6},sidebar:"tutorialSidebar",previous:{title:"Introduction to Blockchain",permalink:"/docs/ethereum/introduction-to-blockchain"},next:{title:"Concurrency in Go",permalink:"/docs/go/concurrency-in-go"}},d=[{value:"TODO",id:"todo",children:[]},{value:"Rocketpool",id:"rocketpool",children:[]},{value:"Setup",id:"setup",children:[{value:"Setting up the services",id:"setting-up-the-services",children:[]},{value:"Installing Rocketpool",id:"installing-rocketpool",children:[]},{value:"Firewall (using UFW)",id:"firewall-using-ufw",children:[]},{value:"Configuring Rocketpool",id:"configuring-rocketpool",children:[]}]},{value:"Execution Node",id:"execution-node",children:[]},{value:"Consensus Node",id:"consensus-node",children:[{value:"Prerequisites",id:"prerequisites",children:[]},{value:"Installation",id:"installation",children:[]},{value:"Running",id:"running",children:[]}]}],h={toc:d};function p(e){var t=e.components,n=(0,a.Z)(e,s);return(0,i.kt)("wrapper",(0,o.Z)({},h,n,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("h1",{id:"staking-on-ethereum-with-rocketpool"},"Staking on Ethereum with Rocketpool"),(0,i.kt)("p",null,"To participate as a validator in Ethereum consensus, we have to stake 32 ETH, which is a lot. With Rocketpool, node operators\nonly require 16 ETH to get started, and since that's all I have right now, this is the way we'll do it."),(0,i.kt)("h3",{id:"todo"},"TODO"),(0,i.kt)("ul",{className:"contains-task-list"},(0,i.kt)("li",{parentName:"ul",className:"task-list-item"},(0,i.kt)("input",{parentName:"li",type:"checkbox",checked:!1,disabled:!0})," ","Is UPnP or PMP necessary?"),(0,i.kt)("li",{parentName:"ul",className:"task-list-item"},(0,i.kt)("input",{parentName:"li",type:"checkbox",checked:!1,disabled:!0})," ","Services have to listen on 0.0.0.0 for RP docker"),(0,i.kt)("li",{parentName:"ul",className:"task-list-item"},(0,i.kt)("input",{parentName:"li",type:"checkbox",checked:!1,disabled:!0})," ","Setup UFW to accept connections from docker"),(0,i.kt)("li",{parentName:"ul",className:"task-list-item"},(0,i.kt)("input",{parentName:"li",type:"checkbox",checked:!1,disabled:!0})," ","Installing the ",(0,i.kt)("a",{parentName:"li",href:"https://docs.rocketpool.net/guides/node/docker.html#downloading-the-rocket-pool-cli"},"rocketpool cli")),(0,i.kt)("li",{parentName:"ul",className:"task-list-item"},(0,i.kt)("input",{parentName:"li",type:"checkbox",checked:!1,disabled:!0})," ","Import node wallet + withdrawal address to Ledger")),(0,i.kt)("h2",{id:"rocketpool"},"Rocketpool"),(0,i.kt)("blockquote",null,(0,i.kt)("p",{parentName:"blockquote"},"Rocket Pool is the base layer protocol for decentralised and trustless ETH2 staking.")),(0,i.kt)("p",null,"With Rocketpool, node operators can collaborate with stakers to create validators. A node operator (us) runs the infrastructure\n(execution + beacon node), and stakes 16 ETH of his own together with some ",(0,i.kt)("strong",{parentName:"p"},"RPL")," tokens (10% of staked ETH) as collateral for slashing insurance.\nStakers can more easily participate because they only require a small amount of ETH to get started. Essentially, Rocketpool splits the difference between those who have the technical skills to run and maintain a node and those who lack the financial capacity to own 32 ETH."),(0,i.kt)("p",null,"As a node operator, you'll also get more ROI in the form of the slashing insurance premiums (RPL) and a commission rate (ETH)."),(0,i.kt)("h2",{id:"setup"},"Setup"),(0,i.kt)("p",null,"We're going to run the execution and consensus clients as services following ",(0,i.kt)("a",{parentName:"p",href:"https://docs.rocketpool.net/guides/node/native.html"},"this guide"),", each with their own service accounts. The service accounts will have limited access to the rest of the system,\nso if one of the clients is compromised, the damage will be contained. The Rocketpool smart node will run in a Docker container.\nThis is the ",(0,i.kt)("a",{parentName:"p",href:"https://docs.rocketpool.net/guides/node/hybrid.html"},"Hybrid Rocket Pool Node")," configuration."),(0,i.kt)("div",{className:"admonition admonition-info alert alert--info"},(0,i.kt)("div",{parentName:"div",className:"admonition-heading"},(0,i.kt)("h5",{parentName:"div"},(0,i.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,i.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"14",height:"16",viewBox:"0 0 14 16"},(0,i.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M7 2.3c3.14 0 5.7 2.56 5.7 5.7s-2.56 5.7-5.7 5.7A5.71 5.71 0 0 1 1.3 8c0-3.14 2.56-5.7 5.7-5.7zM7 1C3.14 1 0 4.14 0 8s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7zm1 3H6v5h2V4zm0 6H6v2h2v-2z"}))),"Storage")),(0,i.kt)("div",{parentName:"div",className:"admonition-content"},(0,i.kt)("p",{parentName:"div"},"The disks you will use as storage should be SSDs, HDD won't cut it. I've mounted some external drives as logical volumes,\nso that I can easily increase capacity in the future. Stats:"),(0,i.kt)("ul",{parentName:"div"},(0,i.kt)("li",{parentName:"ul"},"Erigon drive: 4 TB (right now, state is about 1.6 TB) NVMe"),(0,i.kt)("li",{parentName:"ul"},"Lighthouse drive: 1 TB NVMe")))),(0,i.kt)("h3",{id:"setting-up-the-services"},"Setting up the services"),(0,i.kt)("p",null,"Let's start by creating the service accounts (without login) and service groups:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-bash"},"# -r is for system account, -s specifies shell\nsudo useradd -r -s /sbin/nologin erigon\nsudo useradd -r -s /sbin/nologin lighthouse\n\n# service group\nsudo groupadd ethereum\n")),(0,i.kt)("p",null,"Next, change the ownership of the client directories:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-bash"},"sudo chown -R erigon:ethereum /srv/erigon\nsudo chown -R lighthouse:ethereum /srv/lighthouse\n")),(0,i.kt)("p",null,"We have to be part of the ",(0,i.kt)("inlineCode",{parentName:"p"},"ethereum")," group with our main account to have write access\nto the directories (for updating):"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-bash"},"sudo usermod -aG ethereum $USER\n")),(0,i.kt)("h4",{id:"systemd-service-files"},"Systemd service files"),(0,i.kt)("p",null,"We'll need the following systemd services:"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},"Erigon execution client"),(0,i.kt)("li",{parentName:"ul"},"Rpcdaemon for Erigon"),(0,i.kt)("li",{parentName:"ul"},"Lighthouse beacon node")),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-service",metastring:'title="/etc/systemd/system/erigon.service"',title:'"/etc/systemd/system/erigon.service"'},"[Unit]\nDescription=Erigon\nAfter=network.target\n\n[Service]\nType=simple\nUser=erigon\nRestart=always\nRestartSec=5\nExecStart=/srv/erigon/build/bin/erigon --datadir /mnt/eth-archive --maxpeers 100\n\n[Install]\nWantedBy=multi-user.target\n")),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-text",metastring:'title="/etc/systemd/system/rpcdaemon.service"',title:'"/etc/systemd/system/rpcdaemon.service"'},"[Unit]\nDescription=Rpcdaemon\nAfter=network.target erigon.service\nWants=erigon.service\n\n[Service]\nType=simple\nUser=erigon\nRestart=always\nRestartSec=5\nExecStart=/srv/erigon/build/bin/rpcdaemon --datadir /mnt/eth-archive --ws --http.addr 0.0.0.0 --http.api eth,net,trace,erigon,web3\n\n[Install]\nWantedBy=multi-user.target\n")),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-service",metastring:'title="/etc/systemd/system/lh-bn.service"',title:'"/etc/systemd/system/lh-bn.service"'},"[Unit]\nDescription=Lighthouse Beacon Node\nAfter=network.target rpcdaemon.service\nWants=rpcdaemon.service\n\n[Service]\nType=simple\nUser=lighthouse\nRestart=always\nRestartSec=5\nExecStart=/srv/lighthouse/target/release/lighthouse beacon --network mainnet --datadir /mnt/evo/lighthouse --port 9001 --discovery-port 9001 --eth1 --eth1-endpoints http://localhost:8545 --http --http-address 0.0.0.0 --http-port 5052 --eth1-blocks-per-log-query 150 --disable-upnp\n\n[Install]\nWantedBy=multi-user.target\n")),(0,i.kt)("div",{className:"admonition admonition-caution alert alert--warning"},(0,i.kt)("div",{parentName:"div",className:"admonition-heading"},(0,i.kt)("h5",{parentName:"div"},(0,i.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,i.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"16",height:"16",viewBox:"0 0 16 16"},(0,i.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M8.893 1.5c-.183-.31-.52-.5-.887-.5s-.703.19-.886.5L.138 13.499a.98.98 0 0 0 0 1.001c.193.31.53.501.886.501h13.964c.367 0 .704-.19.877-.5a1.03 1.03 0 0 0 .01-1.002L8.893 1.5zm.133 11.497H6.987v-2.003h2.039v2.003zm0-3.004H6.987V5.987h2.039v4.006z"}))),"caution")),(0,i.kt)("div",{parentName:"div",className:"admonition-content"},(0,i.kt)("p",{parentName:"div"},"The HTTP addresses on rpcdaemon and Lighthouse were changed to 0.0.0.0, because the Rocketpool node, which runs in a Docker container,\notherwise can't reach them. But beware, these APIs are now listening on public interfaces, so make sure your firewall is running."))),(0,i.kt)("h3",{id:"installing-rocketpool"},"Installing Rocketpool"),(0,i.kt)("h4",{id:"installing-the-cli"},"Installing the CLI"),(0,i.kt)("p",null,"We download the CLI following ",(0,i.kt)("a",{parentName:"p",href:"https://docs.rocketpool.net/guides/node/docker.html#downloading-the-rocket-pool-cli"},"this Rocketpool guide"),":"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-bash"},"wget https://github.com/rocket-pool/smartnode-install/releases/latest/download/rocketpool-cli-linux-amd64 -O ./rocketpool\n# Mark as executable and move to somewhere in $PATH\nchmod +x ./rocketpool && sudo mv ./rocketpool /usr/local/bin\n")),(0,i.kt)("p",null,"Test running it with the ",(0,i.kt)("inlineCode",{parentName:"p"},"--version")," flag, which should output something like this:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre"},"$ rocketpool --version\n\nrocketpool version 1.0.0\n")),(0,i.kt)("h4",{id:"installing-the-smartnode-stack"},"Installing the Smartnode Stack"),(0,i.kt)("p",null,"We can install the Smartnode Stack for mainnet like this:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-bash"},"rocketpool service install\n")),(0,i.kt)("p",null,"Next, add yourself to the ",(0,i.kt)("inlineCode",{parentName:"p"},"docker")," group to use Docker without root privileges:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-bash"},"sudo usermod -aG docker $USER\n")),(0,i.kt)("p",null,"You will have to restart your SSH session for these changes to take effect."),(0,i.kt)("div",{className:"admonition admonition-note alert alert--secondary"},(0,i.kt)("div",{parentName:"div",className:"admonition-heading"},(0,i.kt)("h5",{parentName:"div"},(0,i.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,i.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"14",height:"16",viewBox:"0 0 14 16"},(0,i.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M6.3 5.69a.942.942 0 0 1-.28-.7c0-.28.09-.52.28-.7.19-.18.42-.28.7-.28.28 0 .52.09.7.28.18.19.28.42.28.7 0 .28-.09.52-.28.7a1 1 0 0 1-.7.3c-.28 0-.52-.11-.7-.3zM8 7.99c-.02-.25-.11-.48-.31-.69-.2-.19-.42-.3-.69-.31H6c-.27.02-.48.13-.69.31-.2.2-.3.44-.31.69h1v3c.02.27.11.5.31.69.2.2.42.31.69.31h1c.27 0 .48-.11.69-.31.2-.19.3-.42.31-.69H8V7.98v.01zM7 2.3c-3.14 0-5.7 2.54-5.7 5.68 0 3.14 2.56 5.7 5.7 5.7s5.7-2.55 5.7-5.7c0-3.15-2.56-5.69-5.7-5.69v.01zM7 .98c3.86 0 7 3.14 7 7s-3.14 7-7 7-7-3.12-7-7 3.14-7 7-7z"}))),"note")),(0,i.kt)("div",{parentName:"div",className:"admonition-content"},(0,i.kt)("p",{parentName:"div"},"This will download Docker and docker-compose for you, if you already have these installed, run:"),(0,i.kt)("pre",{parentName:"div"},(0,i.kt)("code",{parentName:"pre",className:"language-bash"},"rocketpool service install -d \n")))),(0,i.kt)("h4",{id:"basic-configuration"},"Basic Configuration"),(0,i.kt)("p",null,"Run the following command:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-bash"},"rocketpool service config\n")),(0,i.kt)("p",null,"This will start an interactive process to help with the configuration.\nFor our ETH1 client, even though we're using Erigon, you can select Geth (1) and leave all the default options.\nWe will later modify these."),(0,i.kt)("p",null,"For the ETH2 configuration, make sure to select Lighthouse. This is important, since the validator node\nis part of the Smartnode Stack and needs to be the same client as our Beacon Node. The default settings will do, but you can\nadd your own custom Graffiti! This will be included on every block your validator produces, which is pretty cool."),(0,i.kt)("p",null,"As we've seen, the Smartnode Stack runs with docker-compose. We'll need to change the original compose file:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-yaml",metastring:'title="~/.rocketpool/docker-compose.yml"',title:'"~/.rocketpool/docker-compose.yml"'},'version: "3.4"\nservices:\n  eth1:\n    image: ${ETH1_IMAGE}\n    ...\n  eth2:\n    image: ${ETH2_IMAGE}\n    ...\n    depends_on:\n      - eth1\n  validator:\n    image: ${VALIDATOR_IMAGE}\n    ...\n    depends_on:\n      - eth2\n  api:\n    image: ${SMARTNODE_IMAGE}\n    ...\n    depends_on:\n      - eth1\n    entrypoint: /bin/sleep\n    command: "infinity"\n  node:\n    image: ${SMARTNODE_IMAGE}\n    ...\n    depends_on:\n      - eth1\n      - eth2\n  watchtower:\n    image: ${SMARTNODE_IMAGE}\n    ...\n    depends_on:\n      - eth1\n      - eth2\n')),(0,i.kt)("p",null,"Delete both the ",(0,i.kt)("inlineCode",{parentName:"p"},"eth1")," and ",(0,i.kt)("inlineCode",{parentName:"p"},"eth2")," sections of the configuration, and if they are in another services' ",(0,i.kt)("inlineCode",{parentName:"p"},"depends_on")," section,\nremove them there too."),(0,i.kt)("h4",{id:"creating-docker-networks"},"Creating Docker Networks"),(0,i.kt)("p",null,"Right now, we're going to start and stop the smartnode stack. It won't work yet, but it will create the necessary Docker networks, which\nwe need for later configuration."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-bash"},"rocketpool service start\nrocketpool service stop\n")),(0,i.kt)("p",null,"This will have created a Docker network ",(0,i.kt)("inlineCode",{parentName:"p"},"rocketpool_net"),". Find the subnet with:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-bash"},'docker inspect rocketpool_net | jq .[0].IPAM.Config[0].Subnet\n\n# Example:\nSUBNET="172.18.0.0/16"\n')),(0,i.kt)("p",null,"We can now configure the firewall."),(0,i.kt)("h3",{id:"firewall-using-ufw"},"Firewall (using UFW)"),(0,i.kt)("p",null,"We need to open the correct ports on our machine:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-bash"},'# Erigon\nsudo ufw allow 30303 comment "Erigon eth65 p2p"\nsudo ufw allow 30304 comment "Erigon eth66 p2p"\n\n# where $SUBNET is the Docker subnet you noted before\nsudo ufw allow from $SUBNET to any port 8545 comment "Rocketpool to Erigon"\n# Lighthouse\nsudo ufw allow 9001 comment "Lighthouse p2p"\n\nsudo ufw allow from $SUBNET to any port 5052 comment "Rocketpool to Lighthouse beacon node"\n')),(0,i.kt)("p",null,"Right now the APIs are only reacheable from inside the Docker containers. If you want to reach them from other machines on your network,\nconfigure the firewall accordingly."),(0,i.kt)("div",{className:"admonition admonition-caution alert alert--warning"},(0,i.kt)("div",{parentName:"div",className:"admonition-heading"},(0,i.kt)("h5",{parentName:"div"},(0,i.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,i.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"16",height:"16",viewBox:"0 0 16 16"},(0,i.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M8.893 1.5c-.183-.31-.52-.5-.887-.5s-.703.19-.886.5L.138 13.499a.98.98 0 0 0 0 1.001c.193.31.53.501.886.501h13.964c.367 0 .704-.19.877-.5a1.03 1.03 0 0 0 .01-1.002L8.893 1.5zm.133 11.497H6.987v-2.003h2.039v2.003zm0-3.004H6.987V5.987h2.039v4.006z"}))),"caution")),(0,i.kt)("div",{parentName:"div",className:"admonition-content"},(0,i.kt)("p",{parentName:"div"},"If your machine is behind a router or firewall, make sure to configure port forwarding. This is important for maintaining good\nconnectivity and allowing other peers to discover you."))),(0,i.kt)("h3",{id:"configuring-rocketpool"},"Configuring Rocketpool"),(0,i.kt)("p",null,"We've already done some basic configuration in ",(0,i.kt)("inlineCode",{parentName:"p"},"~/.rocketpool/docker-compose.yml"),", but we're not done yet.\nThe next file we need to configure is ",(0,i.kt)("inlineCode",{parentName:"p"},"~/.rocketpool/config.yml"),"."),(0,i.kt)("h2",{id:"execution-node"},"Execution Node"),(0,i.kt)("h2",{id:"consensus-node"},"Consensus Node"),(0,i.kt)("p",null,"As a consensus node, we're going to install Lighthouse, built with Rust."),(0,i.kt)("h3",{id:"prerequisites"},"Prerequisites"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"https://www.rust-lang.org/tools/install"},"Install Rust"))),(0,i.kt)("h3",{id:"installation"},"Installation"),(0,i.kt)("p",null,"We're going to build from source:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-bash"},"git clone https://github.com/sigp/lighthouse.git\ncd lighthouse\ngit checkout stable\nmake\n")),(0,i.kt)("p",null,"To update:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-bash"},"cd lighthouse\ngit fetch\ngit checkout ${VERSION}\nmake\n")),(0,i.kt)("p",null,"Lighthouse uses port 9000 for both TCP and UDP:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-bash"},"sudo ufw allow 9000\n")),(0,i.kt)("h3",{id:"running"},"Running"),(0,i.kt)("p",null,"As the execution client we use ",(0,i.kt)("a",{parentName:"p",href:"https://github.com/ledgerwatch/erigon"},"Erigon"),". We can now run the lighthouse because node:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-bash"},"lighthouse --datadir /mnt/evo/lighthouse/ --network mainnet bn --staking\n")),(0,i.kt)("p",null,"By default, Lighthouse will look for the Eth1 client RPC at ",(0,i.kt)("strong",{parentName:"p"},"http://localhost:8545"),"."))}p.isMDXComponent=!0}}]);