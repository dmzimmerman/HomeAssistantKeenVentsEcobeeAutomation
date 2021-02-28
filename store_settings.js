// sets the flow-context variable for main vent heat settings
try {
    var settings = JSON.parse(msg.payload);
    flow.set("main_heat", settings);
} catch (e) {
    warn("error while parsing settings");
}