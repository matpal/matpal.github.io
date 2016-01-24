// var icons = {
//     activity: 'img/activity.png',
//     broadcastReceiver: 'img/broadcast-receiver.png',
//     explicitintent: 'img/intent.png',
//     intent: 'img/implicit-intent.png',
//     service : 'img/cog.png',
//     widget: 'img/widget.png'
// }
var ClassTypes = {
    abstract: {
        id: "abstract",
        name: "Abstract",
        icon: ""
    },
    class: {
        id: "custom",
        name: "Class",
        icon: ""
    },
    interface: {
        id: "interface",
        name: "Interface",
        icon: ""
    },
}

var AndroidComponents = {
    activity: {
        id: "activity",
        name: "Activity",
        icon: 'img/activity.png',
    },
    broadcastReceiver: {
        id: 'broadcastReceiver',
        name: "Broadcast Receiver",
        icon: 'img/broadcast-receiver.png',
    },
    contentProvider: {
        id: 'contentProvider',
        name: "Content Provider",
        icon: 'img/content-provider.png',  
    },
    explicitIntent:{
        id: 'explicitIntent',
        name: "Explicit Intent",
        icon: 'img/intent.png',
    },
    implicitIntent:{
        id: 'implicitIntent',
        name: "Implicit Intent",
        icon: 'img/implicit-intent.png',
    },
    layout: {
        id: 'layout',
        name: "Layout",
        icon: 'img/layout.png',
    },
    service: {
        id: 'service',
        name: "Service",
        icon: 'img/cog.png',
    },
    widget: {
        id: 'widget',
        name: "Widget",
        icon: 'img/widget.png'
    },
    noicon:{
      id: 'noicon',
      name: "No Icon",
      icon: ''  
    }
    
}

var UmlLinks = {
    aggregation: {
        id: 'aggregation',
        name: "Aggregation",
        icon: "img/aggregation.png",
    },
    composition: {
        id: 'composition',
        name: "Composition",
        icon: "img/composition.png",
    },
    generalization: {
        id: 'generalization',
        name: "Generalization",
        icon: "img/generalization.png",
    },
    implementation: {
        id: 'implementation',
        name: "Implementation",
        icon: "img/implementation.png",
    },
    
}

joint.shapes.uml.AndroidComponent = joint.shapes.basic.Generic.extend({

    markup: [
        '<g class="rotatable">',
          '<g class="scalable">',
            '<rect class="component-name-rect"/><rect class="component-content-rect"/>',
          '</g>',
          '<text class="component-name-text"/><text class="component-content-text"/><image/>',
        '</g>'
    ].join(''),

    defaults: joint.util.deepSupplement({

        type: 'uml.AndroidComponent',

        attrs: {
            rect: { 'width': 200 },
            // #3498db
            // #6ab344  android green
            // #64b5f6  ligth blue
            '.component-name-rect': { 'stroke': 'black', 'stroke-width': 1, 'fill': '#64b5f6' },
            // #2980b9
            '.component-content-rect': { 'stroke': 'black', 'stroke-width': 1, 'fill': '#ffffff' },
            

            '.component-name-text': {
                'ref': '.component-name-rect', 'ref-y': .5, 'ref-x': .5, 'text-anchor': 'middle', 'y-alignment': 'middle', 'font-weight': 'bold',
                'fill': 'black', 'font-size': 14, 'font-family': 'Times New Roman'
            },
            '.component-content-text': {
                'ref': '.component-content-rect', 'ref-y': 5, 'ref-x': 5,
                'fill': 'black', 'font-size': 12, 'font-family': 'Times New Roman'
            },
            
            'image': {
                'xlink:href': '',  width: 24, height:24,x:0, y:0,'ref-x': -12, 'ref-y': 6, ref: '.component-name-text','y-alignment': 'middle', 'x-alignment': 'middle'
            },
        },

        name: [],
        content: [],

    }, joint.shapes.basic.Generic.prototype.defaults),

    initialize: function() {

        this.on('change:name change:content', function() {
            this.updateRectangles();
            this.trigger('uml-update');
        }, this);

        this.updateRectangles();

        joint.shapes.basic.Generic.prototype.initialize.apply(this, arguments);
    },

    getClassName: function() {
        return this.get('name');
    },

    updateRectangles: function() {

        var attrs = this.get('attrs');

        var rects = [
            { type: 'name', text: this.getClassName() },
            { type: 'content', text: this.get('content') },
            
        ];

        var offsetY = 0;

        _.each(rects, function(rect) {

            var lines = _.isArray(rect.text) ? rect.text : [rect.text];
            var rectHeight = lines.length * 20 + 20;

            attrs['.component-' + rect.type + '-text'].text = lines.join('\n');
            attrs['.component-' + rect.type + '-rect'].height = rectHeight;
            attrs['.component-' + rect.type + '-rect'].transform = 'translate(0,' + offsetY + ')';

            offsetY += rectHeight;
        });
    }

});