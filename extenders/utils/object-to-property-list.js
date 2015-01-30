function objectToPropertyList(source) {
    var plist = {};
    var propNames = Object.getOwnPropertyNames(source);

    for (var i = 0; i < propNames.length; i += 1) {
        var propName = propNames[i];
        plist[propName] = Object.getOwnPropertyDescriptor(source, propName);
    }

    return plist;
}

module.exports = objectToPropertyList;
