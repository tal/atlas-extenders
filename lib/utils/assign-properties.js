function assignPropertiesFromOne(target, source) {
    var propNames = Object.getOwnPropertyNames(source);

    for (var i = 0; i < propNames.length; i += 1) {
        var propName = propNames[i];
        var prop = Object.getOwnPropertyDescriptor(source, propName);

        Object.defineProperty(target, propName, prop);
    }
}

function assignProperties(target /*, source, source, source, source */) {
    for (var i = 1; i < arguments.length; i += 1) {
        assignPropertiesFromOne(target, arguments[i]);
    }

    return target;
}

module.exports = assignProperties;
