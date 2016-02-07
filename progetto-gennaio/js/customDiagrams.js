/* global MyPaper */
/* global AndroidRect */
/* global createUmlLink */
// DATA
var colors = {
    customClass: {
        titleBackground: "#DAEEFD",
        titleBorder: "#DAEEFD",
        propBackground: "#FFFFFF",
        propBorder: "#DAEEFD",    
    },
    androidComponent: {
        titleBackground: "#8BC34A",
        titleBorder: "#8BC34A",
        propBackground: "#FFFFFF",
        propBorder: "#8BC34A",  
        textColor: "#FFFFFF"
    }
    
}

var widgets = [ 
// Direct Subclasses of View
"AnalogClock",  
"ImageView",
"KeyboardView", 
"MediaRouteButton",
"ProgressBar",	
"Space",
"SurfaceView", 
"TextView", 
"TextureView", 
"ViewStub",	
];
// Indirect Subclasses of View
// "AbsListView",	 
// "AbsSeekBar",	 
// "AbsSpinner",	
// "ActionMenuView",	
// "AppCompatAutoCompleteTextView",	 
// "AppCompatButton",	
// "AppCompatCheckBox",	 
// "AppCompatCheckedTextView", 
// "AppCompatEditText",	
// "AppCompatImageButton",
// "AppCompatImageView",	
// "AppCompatMultiAutoCompleteTextView", 
// "AppCompatRadioButton",	
// "AppCompatRatingBar",	 
// "AppCompatSeekBar",	 
// "AppCompatSpinner",	
// "AppCompatTextView",
// "AppWidgetHostView", 
// "AutoCompleteTextView",	
// "Button",	
// "CalendarView", 
// "CheckBox",	
// "CheckedTextView", 
// "Chronometer",	 
// "CompoundButton",	
// "ContentLoadingProgressBar", 
// "DatePicker", 
// "DialerFilter",	 
// "DigitalClock",  
// "EditText",	 
// "ExpandableListView",	 
// "ExtractEditText",	 
// "FloatingActionButton", 
// "FragmentBreadCrumbs",	  
// "FragmentTabHost",	 
// "GLSurfaceView", 
// "GestureOverlayView", 
// "GuidedActionEditText", 
// "ImageButton",	
// "ImageCardView", 
// "ImageSwitcher",	 
// "ListRowHoverCardView", 
// "ListView",	 
// "MediaController", 
// "MultiAutoCompleteTextView",	
// "NavigationView",	 
// "NumberPicker",	 
// "PagerTabStrip",	 
// "PagerTitleStrip",	 
// "QuickContactBadge", 
// "RadioButton",	
// "RadioGroup",	
// "RatingBar", 
// "RecyclerView",	 
// "RowHeaderView", 
// "SearchBar", 
// "SearchEditText", 
// "SearchOrbView",	
// "SearchView", 
// "SeekBar",	 
// "SlidingDrawer",  
// "SlidingPaneLayout", 
// "Space",	  
// "SpeechOrbView", 
// "Spinner",	 
// "StackView",	 
// "Switch", 
// "SwitchCompat", 
// "TabWidget", 
// "TextClock",	
// "TextSwitcher", 
// "TimePicker",	 
// "TitleView",	 
// "ToggleButton",
// "Toolbar",	 
// "TvView",	 
// "VideoView", 
// "WebView",	
// "ZoomButton",	 
// "ZoomControls",

var layouts = [ 
// Direct Subclasses of ViewGroup
"AbsoluteLayout",	 
"AdapterView", 
"CoordinatorLayout", 
"DrawerLayout",	 
"FragmentBreadCrumbs",	  
"FrameLayout",	 
"GridLayout",	 
"LinearLayout",	 
"LinearLayoutCompat", 
"PagerTitleStrip",	
"RecyclerView",	 
"RelativeLayout",	
"SlidingDrawer",	
"SlidingPaneLayout",	
"SwipeRefreshLayout",	 
"Toolbar",	 
"TvView",
"ViewGroup",	 
"ViewPager",
];
// Indirect Subclasses of ViewGroup
// "AbsListView", 
// "AbsSpinner", 
// "ActionMenuView", 
// "AdapterViewAnimator", 
// "AdapterViewFlipper", 
// "AppBarLayout", 
// "AppCompatSpinner",
// "AppWidgetHostView", 
// "BaseCardView", 
// "BrowseFrameLayout", 
// "CalendarView", 
// "CardView", 
// "CollapsingToolbarLayout",
// "DatePicker",	 
// "DialerFilter",	 
// "ExpandableListView",	 
// "FragmentTabHost",	 
// "Gallery",	  
// "GestureOverlayView", 
// "GridView", 
// "HorizontalGridView", 
// "HorizontalScrollView",
// "ImageCardView",	 
// "ImageSwitcher",	 
// "ListRowHoverCardView", 
// "ListRowView",	 
// "ListView",	 
// "MediaController", 
// "NavigationView", 
// "NestedScrollView", 
// "NumberPicker",	 
// "PagerTabStrip",	
// "PercentFrameLayout", 
// "PercentRelativeLayout",
// "RadioGroup",	
// "ScrollView", 
// "SearchBar", 
// "SearchOrbView",	
// "SearchView", 
// "ShadowOverlayContainer",
// "SpeechOrbView", 
// "Spinner", 
// "StackView",	 
// "TabHost", 
// "TabLayout", 
// "TabWidget", 
// "TableLayout",	
// "TableRow", 
// "TextInputLayout", 
// "TextSwitcher", 
// "TimePicker", 
// "TitleView", 
// "TwoLineListItem",
// "VerticalGridView", 
// "ViewAnimator", 
// "ViewFlipper", 
// "ViewSwitcher", 
// "WebView",	
// "ZoomControls", 	 

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
    association: {
        id: 'association',
        name: "Association",
        icon: "img/association.png",
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

// CLASSES

function MyPaper(elementContainer){
    var self = this;
    this.graph = new joint.dia.Graph;
    this.paper = new joint.dia.Paper({
        el: elementContainer,
        width: '100%',
        height: 500,
        model: this.graph,
        gridSize: 1,
    });
    // this.paper.on('cell:pointerdown', 
    //     function(cellView, evt, x, y) { 
    //         // alert('cell view ' + cellView.model.id + ' was clicked');
    //         cellView.highlight(); 
            
    //     }
    // );
    // this.paper.on('blank:pointerclick',
    //        function(){
    //             var cells = self.graph.getCells();
    //             for(var t = 0; t < cells.lenght;t++){
    //                 cells[t].unhighlight();
    //             }
    //            }
    //     );
  
    
}


    
MyPaper.prototype = {
    constructor: MyPaper,
}

function AndroidRect(xPos,yPos, name, type){
    return new joint.shapes.uml.AndroidComponent({
                    position: { x:xPos  , y: yPos },
                    size: { width: name.length*10+52, height: 100 },
                    name: name,
                    content: ['...'],
                    attrs: {
                        image:{
                            'xlink:href' : AndroidComponents[type].icon
                        }
                    }
                });
}
// FUNCTIONS
function createUmlLink(from, to, type){
    switch(type){
        case "aggregation":
            return new joint.shapes.uml.Aggregation({
                source: {id: from},
                target: {id: to},
            });
            break;
        case "association":
            return new joint.shapes.uml.Association({
                source: {id: from},
                target: {id: to},
            });
            break;
        case "composition":
            return new joint.shapes.uml.Composition({
                source: {id: from},
                target: {id: to},
            });
            break;
        case "generalization":
            return new joint.shapes.uml.Generalization({
                source: {id: from},
                target: {id: to},
            });
            break;
        case "implementation":
            return new joint.shapes.uml.Implementation({
                source: {id: from},
                target: {id: to},
            });
            break;
        default: 
            console.log("UML Link not valid");
            return null;
    }
}

function createAndroidComponent(obj){
        var rectName = $('#' + obj.currentActivity.nome() + 'ComponentName').val();
        var rectType = $('#' + obj.currentActivity.nome() + 'ComponentType').find(":selected").attr('id');
        var relationType = $('#' + obj.currentActivity.nome() + 'ComponentRelationType').find(":selected").attr('id');
        var parentId = $('#' + obj.currentActivity.nome() + 'ComponentParentName').find(":selected").attr('id');

        var rect = AndroidRect(0,0, rectName, rectType); 
        obj.currentActivity.recs.add(rect);
        // obj.recsID.add({id:rect.id,name:rectName});
        obj.updateDiagram();
         
        // var link = new joint.shapes.uml.Generalization({
        //     source:{id: rect.id},
        //     target:{id: this.currentActivity.recs()[0].id}
        // });

        var link = createUmlLink(rect.id, parentId, relationType );
        obj.currentActivity.paper.graph.addCell(link);
        
        $('select').material_select();
}

function createCustomLink(obj){
    var parentId = $('#' + obj.currentActivity.nome() + 'LinkComponentParentName').find(":selected").attr('id');
    var childId = $('#' + obj.currentActivity.nome() + 'LinkComponentChildName').find(":selected").attr('id');
    var relationType = $('#' + obj.currentActivity.nome() + 'LinkComponentRelationType').find(":selected").attr('id');
    
    var link = createUmlLink(childId, parentId, relationType );
    obj.currentActivity.paper.graph.addCell(link);
    
    $('select').material_select();
   
}

function createCustomClass(obj){
    var rectName = $('#' + obj.currentActivity.nome() + 'CustomClassName').val();
        var rectType = $('#' + obj.currentActivity.nome() + 'CustomClassType').find(":selected").attr('id');
        var relationType = $('#' + obj.currentActivity.nome() + 'CustomClassRelationType').find(":selected").attr('id');
        var parentId = $('#' + obj.currentActivity.nome() + 'CustomClassParentName').find(":selected").attr('id');
        
        var rectDefinition = {
            position: { x:300  , y: 300 },
            size: { width: 260, height: 100 },
            name: rectName,
            attrs: {
                '.uml-class-name-rect': {
                    fill: colors.customClass.titleBackground,
                    stroke: colors.customClass.titleBorder,
                    'stroke-width': 2
                },
                '.uml-class-attrs-rect, .uml-class-methods-rect': {
                    fill: colors.customClass.propBackground,
                    stroke: colors.customClass.propBorder,
                    'stroke-width': 2
                },
                '.uml-class-methods-text, .uml-class-attrs-text': {
                    fill: colors.customClass.propBackground,
                }
            }
        }
        
        switch(rectType){
            case "abstract": 
                var rect = new joint.shapes.uml.Abstract(rectDefinition);
                break;
            case "custom":
                var rect = new joint.shapes.uml.Class(rectDefinition);
                break;
            case "interface":
                var rect = new joint.shapes.uml.Interface(rectDefinition);
                break;
        }
        
        obj.currentActivity.recs.add(rect);
        // obj.recsID.add({id:rect.id,name:rectName});
        obj.updateDiagram();
        
        var link = createUmlLink(rect.id, parentId, relationType );
        obj.currentActivity.paper.graph.addCell(link);      
        
        $('select').material_select();
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
                'fill': colors.androidComponent.textColor, 'font-size': 14, 'font-family': 'Times New Roman'
            },
            '.component-content-text': {
                'ref': '.component-content-rect', 'ref-y': 5, 'ref-x': 5,
                'fill': 'black', 'font-size': 12, 'font-family': 'Times New Roman'
            },
            
            'image': {
                'xlink:href': '',  width: 24, height:24,x:0, y:0,'ref-x': -20, 'ref-y': 6, ref: '.component-name-text','y-alignment': 'middle', 'x-alignment': 'middle'
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

function searchArrayOfObj(arrayObj, arrayProp, element){
    for(var i = 0; i < arrayObj.length; i++){
        if(arrayObj[i][arrayProp]() === element){
            return arrayObj[i];
        }
    }
}
