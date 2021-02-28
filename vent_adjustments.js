// constants
const position_fudge_factor = 5;
const min_bound = -100;
const max_bound = 100;

// figure out what we're adjusting, and for heating or cooling
var settings;
var action;
var success = true;

try {
    if (msg.payload.settings === undefined || 
        msg.payload.action === undefined) {
            node.warn("incomplete parameters, aborting");
            success = false;
    } else {
        settings_name = msg.payload.settings;
        action = msg.payload.action;
        settings = flow.get(settings_name);
        if (settings.vst === undefined ||
            settings.thresholds === undefined) {
            node.warn("no settings available for " + parameters.settings);
            success = false;    
        }
    }
} catch (e) {
    node.warn("error with parameters, aborting");
    success = false;
}

if (success) {
  const globalHomeAssistant = global.get('homeassistant');
  settings.vst.forEach(function (vst) {
    // for each vent/sensor/target, compare the temperature
    // with the target and generate a message adjusting the vent
    // accordingly
    node.warn("working with vent " + vst.vent);
    new_position = 8;
    current_temp = globalHomeAssistant.homeAssistant.states[vst.sensor].state;
    target_temp = globalHomeAssistant.homeAssistant.states[vst.target].state;
    
    // direction of the difference depends on whether we're heating or cooling
    // calculate for heating first
    diff = target_temp - current_temp;
    node.warn(action + ": target temp = " + target_temp + ", current temp = " + current_temp + ", difference = " + diff);
    var new_position = -1;
    settings.thresholds.forEach(function (threshold) {
        var lower_bound = min_bound; // constant low enough to always be below the diff
        var upper_bound = max_bound; // constant high enough to always be above the diff
        if (threshold.lower_bound != undefined) {
            lower_bound = threshold.lower_bound;
        }
        if (threshold.upper_bound != undefined) {
            upper_bound = threshold.upper_bound;
        }
        if (lower_bound <= diff && diff < upper_bound) {
            new_position = threshold.position;
        }
    });
    if (new_position < 0) {
        node.warn("no change in vent position, bad thresholds")
        return; // to the next loop iteration, since it's a forEach
    } else {
        node.warn("new vent position = " + new_position);
    }
    // check to see if the current position is already the same
    vent_entities = globalHomeAssistant.homeAssistant.states[vst.vent].attributes["entity_id"];
    node.warn("entities in group: " + vent_entities);
    vent_entities.forEach(function (vent_name) {
      vent = globalHomeAssistant.homeAssistant.states[vent_name];
      friendly_name = vent.attributes["friendly_name"];
      position = vent.attributes["current_position"];
      if (Math.abs(position - new_position) > position_fudge_factor) {
        node.warn(friendly_name + " currently at " + position + ", changing position");
        new_msg = { payload: msg.payload, topic: msg.topic };
        new_msg.payload = { "vent_name": friendly_name, "data": {"entity_id": vent_name, "position": new_position} };
        node.send(new_msg);
      } else {
        node.warn(friendly_name + " already at position " + position);
      }
    });
  });
}

return;
