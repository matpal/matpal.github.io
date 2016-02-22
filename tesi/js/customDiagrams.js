joint.shapes.uml.AndroidComponent = joint.shapes.basic.Generic.extend({

    markup: [
        '<g class="rotatable">',
          '<g class="scalable">',
            '<rect class="component-name-rect"/><rect class="component-content-rect"/>',
          '</g>',
          '<text class="component-name-text"/><text class="component-content-text"/><image/>',
          '<g class="btn del"><circle class="del"/><text class="del">X</text></g>',
        '</g>'
    ].join(''),

    defaults: joint.util.deepSupplement({

        type: 'uml.AndroidComponent',

        attrs: {
            rect: { 'width': 200 },
            '.component-name-rect': {
                'stroke': colors.androidComponent.titleBorder,
                'stroke-width': 2,
                'fill': colors.androidComponent.titleBackground },

            '.component-content-rect': {
                'stroke': colors.androidComponent.propBorder,
                'stroke-width':1,
                'fill': colors.androidComponent.propBackground },


            '.component-name-text': {
                'ref': '.component-name-rect', 'ref-y': .5, 'ref-x': .5, 'text-anchor': 'middle', 'y-alignment': 'middle', 'font-weight': 'bold',
                'fill': colors.androidComponent.textColor, 'font-size': 16, 'font-family': 'Times New Roman'
            },
            '.component-content-text': {
                'ref': '.component-content-rect', 'ref-y': 5, 'ref-x': 5,
                'fill': 'black', 'font-size': 12, 'font-family': 'Times New Roman'
            },

            'image': {
                'xlink:href': '',  width: 24, height:24,x:0, y:0,'ref-x': -20, 'ref-y': 6, ref: '.component-name-text','y-alignment': 'middle', 'x-alignment': 'middle'
            },
            '.btn.del': {
                'ref-x': .85,'ref-y': .6,
                'text-anchor': 'right', 'y-alignment': 'middle',
                'ref': '.component-name-rect'
            },
            '.btn>circle': { r: 10, fill: 'transparent', stroke: '#333', 'stroke-width': 1 },
            '.btn.del>text': { fill: '#000','font-size': 16, 'font-weight': 500, stroke: "#000", x: -5, y: 6, 'font-family': 'Verdana' },
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

joint.shapes.uml.CustomClass = joint.shapes.basic.Generic.extend({
    markup : [
        '<g class="rotatable">',
          '<g class="scalable">',
            '<rect class="uml-class-name-rect"/><rect class="uml-class-attrs-rect"/><rect class="uml-class-methods-rect"/>',
          '</g>',
          '<text class="uml-class-name-text"/>',
          '<g class="btn del"><circle class="del"/><text class="del">X</text></g><text class="uml-class-attrs-text"/><text class="uml-class-methods-text"/>',
        '</g>'
    ].join(''),


    defaults: joint.util.deepSupplement({

        type: 'uml.Class',

        attrs: {
            rect: { 'width': 200 },

            '.uml-class-name-rect': { 'stroke': 'black', 'stroke-width': 2, 'fill': '#3498db' },
            '.uml-class-attrs-rect': { 'stroke': 'black', 'stroke-width': 2, 'fill': '#2980b9' },
            '.uml-class-methods-rect': { 'stroke': 'black', 'stroke-width': 2, 'fill': '#2980b9' },

            '.uml-class-name-text': {
                'ref': '.uml-class-name-rect', 'ref-y': .5, 'ref-x': .5, 'text-anchor': 'middle', 'y-alignment': 'middle', 'font-weight': 'bold',
                'fill': 'black', 'font-size': 12, 'font-family': 'Times New Roman'
            },
            '.uml-class-attrs-text': {
                'ref': '.uml-class-attrs-rect', 'ref-y': 5, 'ref-x': 5,
                'fill': 'black', 'font-size': 12, 'font-family': 'Times New Roman'
            },
            '.uml-class-methods-text': {
                'ref': '.uml-class-methods-rect', 'ref-y': 5, 'ref-x': 5,
                'fill': 'black', 'font-size': 12, 'font-family': 'Times New Roman'
            },
            '.btn.del' : {
                'ref-x': .85,'ref-y': .6,
                'text-anchor': 'right', 'y-alignment': 'middle',
                'ref': '.uml-class-name-rect'
            },
            '.btn>circle': { r: 10, fill: 'transparent', stroke: '#333', 'stroke-width': 1 },
            '.btn.del>text' : {
                fill: '#000','font-size': 16, 'font-weight': 500, stroke: "#000", x: -5, y: 6, 'font-family': 'Verdana'
            },
        },

        name: [],
        attributes: [],
        methods: []

    }, joint.shapes.basic.Generic.prototype.defaults),

    initialize: function() {

        this.on('change:name change:attributes change:methods', function() {
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
            { type: 'attrs', text: this.get('attributes') },
            { type: 'methods', text: this.get('methods') }
        ];

        var offsetY = 0;

        _.each(rects, function(rect) {

            var lines = _.isArray(rect.text) ? rect.text : [rect.text];
            var rectHeight = lines.length * 20 + 20;

            attrs['.uml-class-' + rect.type + '-text'].text = lines.join('\n');
            attrs['.uml-class-' + rect.type + '-rect'].height = rectHeight;
            attrs['.uml-class-' + rect.type + '-rect'].transform = 'translate(0,' + offsetY + ')';

            offsetY += rectHeight;
        });
    }

});

joint.shapes.uml.Abstract.markup = [
    '<g class="rotatable">',
      '<g class="scalable">',
        '<rect class="uml-class-name-rect"/><rect class="uml-class-attrs-rect"/><rect class="uml-class-methods-rect"/>',
      '</g>',
      '<text class="uml-class-name-text"/>',
      '<g class="btn del"><circle class="del"/><text class="del">X</text></g><text class="uml-class-attrs-text"/><text class="uml-class-methods-text"/>',
    '</g>'
].join('');

joint.shapes.uml.Abstract = joint.shapes.uml.CustomClass.extend({

    defaults: joint.util.deepSupplement({
        type: 'uml.Abstract',
        attrs: {
            '.btn.del' : {
                'ref-x': .85,'ref-y': .6,
                'text-anchor': 'right', 'y-alignment': 'middle',
                'ref': '.uml-class-name-rect'
            },
            '.btn>circle': { r: 10, fill: 'transparent', stroke: '#333', 'stroke-width': 1 },
            '.btn.del>text' : {
                fill: '#000','font-size': 16, 'font-weight': 500, stroke: "#000", x: -5, y: 6, 'font-family': 'Verdana'
            },
        }
    }, joint.shapes.uml.CustomClass.prototype.defaults),

    getClassName: function() {
        return ['<<Abstract>>', this.get('name')];
    }

});

joint.shapes.uml.Interface.markup = [
    '<g class="rotatable">',
      '<g class="scalable">',
        '<rect class="uml-class-name-rect"/><rect class="uml-class-attrs-rect"/><rect class="uml-class-methods-rect"/>',
      '</g>',
      '<text class="uml-class-name-text"/>',
      '<g class="btn del"><circle class="del"/><text class="del">X</text></g><text class="uml-class-attrs-text"/><text class="uml-class-methods-text"/>',
    '</g>'
].join('');

joint.shapes.uml.Interface = joint.shapes.uml.CustomClass.extend({

    defaults: joint.util.deepSupplement({
        type: 'uml.Interface',
        attrs: {
            '.btn.del' : {
                'ref-x': .85,'ref-y': .6,
                'text-anchor': 'right', 'y-alignment': 'middle',
                'ref': '.uml-class-name-rect'
            },
            '.btn>circle': { r: 10, fill: 'transparent', stroke: '#333', 'stroke-width': 1 },
            '.btn.del>text' : {
                fill: '#000','font-size': 16, 'font-weight': 500, stroke: "#000", x: -5, y: 6, 'font-family': 'Verdana'
            },
        }
    }, joint.shapes.uml.CustomClass.prototype.defaults),

    getClassName: function() {
        return ['<<Interface>>', this.get('name')];
    }

});
