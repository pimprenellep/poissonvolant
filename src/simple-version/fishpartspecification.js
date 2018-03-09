
const FishPartSpecification = {
    getBodySpecs: function(points) {
        return {
            'type': 'body',
            'points': points,
        };
    },

    getSingleFinSpecs: function(points) {
        return {
            'type' : 'single-fin',
            'points' : points,
        };   
    },

    getDoubleFinSpecs: function(points, contact, rotation) {
        return {
            'type' : 'double-fins',
            'points' : points,
            'contact' : contact,
            'rotation' : rotation,
        };
    },

    getWingSpecs: function(points, contact, rotation) {
        return {
            'type' : 'wings',
            'points' : points,
            'contact' : contact,
            'rotation' : rotation,
        };
    },


    getEyeSpecs: function(center, radiusX, radiusY) {
        return {
            'type' : 'eye',
            'center' : center,
            'radiusX' : radiusX,
            'radiusY' : radiusY,
        };
    },
};