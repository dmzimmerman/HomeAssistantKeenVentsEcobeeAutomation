# HomeAssistantKeenVentsEcobeeAutomation
The integration scripts and configuration files I'm using for my vents.
These integration scripts and configurations must be adjusted for use with your particular setup.
## Prerequisites
### Node-RED
Node-RED needs to be installed and functioning.
### zigbee to control the vents
One of the zigbee integrations functioning in HA, with keen vents mapped and functioning (the author of the readme @dkitsov uses the Mosquitto broker to talk to a Rpi3 that is running Zigbee2MQTT working with deconz—but there are so many other options). You should be able to control the vents from the HA, with the 100% value corresponding to fully open, and the 0% value corresponding to fully closed for the Keen Vents.
### HA climate control and room sensors
ecobee, or any other climate control system supported by HA that exposes the remote, per-room temperature sensors to HA. Alternatively, room sensors independent of the climate control system (thermostat) can be used. Still, there will be less of an alignment between what the thermostat will believe is the current house temperature (including the rooms), and the run times may not be perfectly aligned with the needs of the per-room climate control.

## Nice to have
File Editor, a HA Official add-on—this will allow for modification of various configuration files, making it all work.

## Installation
### vent-settings folder
This folder needs to be placed in the **/config/**
You can remove or rename two or more of the .json files in that folder, depending on how many thermostats and AC units you have. If you choose to rename any of the .json files to suit your setup, you will have to edit the '…Vent Heat Settings' nodes in the Node-RED flow accordingly.

### node-red-flow.json
Import a flow using the Import command in Node-RED
You will have to modify the flow and the content of some of the nodes to make it work for your setup.
For example, the @dkitsov does not have two thermostats and only has one AC unit, so all of the 'Theatre' nodes were removed from the node tree.

### smart_vent_control.yaml
Place this into the /config/packages.

Edit the /config/configuration.yaml to include:
```
homeassistant:
  packages: !include_dir_named packages
  
```
You will need to edit this file to align it with your setup.
