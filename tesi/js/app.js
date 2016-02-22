var App = blocks.Application();
ANDROID_MANIFEST_CONTENT = "";
ANDROID_MANIFEST_NAME = "";

/*
 *
 *  MODELS
 *
 */

var AndroidManifest = App.Model({
    fileName: blocks.observable(""),
    fileContent: blocks.observable(""),
    uploaded: blocks.observable(false),
});

function MyDiagram(elementContainer){
    
    this.graph = new joint.dia.Graph;
    this.paper = new joint.dia.Paper({
        el: elementContainer,
        width: '100%',
        height: 400,
        model: this.graph,
        gridSize: 1
    });
}

MyDiagram.prototype = {
    constructor: MyDiagram,
}

var Activity = App.Model({
    nome : blocks.observable(),
    isAttiva: blocks.observable(false),
    dia: blocks.observable(),

    setAttiva: function(){
        var activityNames = App.Source.activityNames;
        for(i=0; i< activityNames().length; i++){
            if(activityNames()[i].isAttiva()){
                activityNames()[i].isAttiva(false);
            }
        }
        this.isAttiva(true);
        
        this.dia = ((this.dia instanceof MyDiagram) || new MyDiagram($('#'+this.nome)));
        if(this.dia instanceof MyDiagram){

            var c = new joint.shapes.uml.Class({
                position: { x:20  , y: 190 },
                size: { width: this.nome().length*10, height: 100 },
                name: this.nome,
                attributes: [],
                methods: ['+ isCompatible(bG: String): Boolean'],
                attrs: {
                    '.uml-class-name-rect': {
                        // fill: '#ff8450',
                        fill: '#64B5F6',
                        stroke: '#fff',
                        'stroke-width': 0.5,
                    },
                    '.uml-class-attrs-rect, .uml-class-methods-rect': {
                        fill: '#ddd',
                        stroke: '#fff',
                        'stroke-width': 0.5
                    },
                    '.uml-class-attrs-text': {
                        ref: '.uml-class-attrs-rect',
                        'ref-y': 0.5,
                        'y-alignment': 'middle'
                    },
                    '.uml-class-methods-text': {
                        ref: '.uml-class-methods-rect',
                        'ref-y': 0.5,
                        'y-alignment': 'middle'
                    }
                }
            });
            this.dia.graph.addCell(c);    
        }
    },


});

var MemberField = App.Model({
    name: App.Property(),

    editing: blocks.observable(false),

    toggleEdit: function() {
        this.editing(!this.editing());
    },

    remove: function() {
        this.destroy(true);
    }
});

var Method = App.Model({
    name: App.Property(),

    editing: blocks.observable(false),

    toggleEdit: function() {
        this.editing(!this.editing());
    },

    remove: function() {
        this.destroy(true);
    }
});

// Collections

var MemberFields = App.Collection(MemberField);
var Methods = App.Collection(Method);
var Activities = App.Collection(Activity);



/*
 *
 *  VIEWS
 *
 */


App.View('MemberFields', {
    newMemberField: MemberField(),

    memberFields: MemberFields([]),

    keydown: function(e) {
        if (e.which == 13) {
            this.memberFields.add(this.newMemberField);
            this.newMemberField.reset();
        }
    }
});

App.View('Methods', {
    newMethod: Method(),

    methods: Methods([]),

    keydown: function(e) {
        if (e.which == 13) {
            this.methods.add(this.newMethod);
            this.newMethod.reset();
        }
    }
});


App.View('Source', {
    manifest: AndroidManifest(),

    // activityNames : blocks.observable([]),
    activityNames : Activities(),

    serviceNames : blocks.observable([]),
    
    diagram : blocks.observable(),


    uploadFile: function(evt) {
        this.loadFile();

    },

    loadFile: function(evt) {
        // var self = this;
        // console.log("Self is "+ self);
        var file = document.getElementById("fileUploadButton").files[
            0];
        var fileType = /\.xml$/;

        if (file) {

            if (file.name.match(fileType)) {


                var reader = new FileReader();
                var cb = function(data,filename) {
                    ANDROID_MANIFEST_CONTENT = data;
                    ANDROID_MANIFEST_NAME = filename;
                }

                reader.onload = function(e) {
                    $.when(
                        cb(e.target.result, file.name)
                    ).then(
                        function(){
                            this.App.Source.addFile();
                            // console.log("after all" + ANDROID_MANIFEST_CONTENT);
                            var listaAttivita = this.App.Source.getComponent('activity');
                            for(i=0; i< listaAttivita.length; i++){
                                
                                var newActivity = Activity({
                                    nome: listaAttivita[i],
                                    isAttiva:false,
                                    
                                });
                                

                                this.App.Source.activityNames.push(newActivity);
                                // console.dir(this.App.Source.activityNames());
                            }

                            // newActivity.nome()
                            // this.App.Source.activityNames.addMany(this.App.Source.getComponent('activity'));
                            this.App.Source.serviceNames.addMany(this.App.Source.getComponent('service'));
                            this.App.Source.manifest.uploaded(true);
                        }
                    );

                }

                reader.readAsText(file);

                console.log("Name: " + file.name + "\n" +
                    "Last Modified Date :" + file.lastModifiedDate
                );

                // ANDROID_MANIFEST_NAME = file.name;

            } else {
                console.log("Only java files supported.");
            }
        } else {
            console.log("Can't open file.");
        }


    },

    addFile: function(evt) {
        // this.javaFiles.removeAll();
        this.manifest.fileName(ANDROID_MANIFEST_NAME);
        this.manifest.fileContent(ANDROID_MANIFEST_CONTENT);
        // console.dir(this.manifest);
        // this.javaFiles.add(this.manifest);
        // this.manifest.reset();

    },

    getComponent: function(component){
        xmlDoc = $.parseXML(this.manifest.fileContent()),
        $xml = $(xmlDoc),
        componentNameList = $xml.find(component);

        var names = [];

        componentNameList.each(function(){
            names.push($(this).attr("android:name").split('.').pop());
            // arrayName.split('.').pop();   restituisce il nome della classe
        });

        return names;
    },

    // resetta: function(){
    //     for(i=0; i<this.activityNames().length; i++){
    //         if(this.activityNames()[i].isAttiva()){
    //             console.log("resetto l'attivity " + i);
    //             this.activityNames()[i].isAttiva(false);
    //         }
    //     }
    // },

    createDiagram: function(nomignolo){
        console.log();
        // this.graph = new joint.dia.Graph;

        // this.paper = new joint.dia.Paper({
        //     el: $('#myholder'),
        //     width: 600,
        //     height: 200,
        //     model: this.graph,
        //     gridSize: 1
        // });

        // var rect = new joint.shapes.basic.Rect({
        //     position: { x: 100, y: 30 },
        //     size: { width: 30, height: 30 },
        //     attrs: { rect: { fill: 'blue' }, text: { text: nomignolo, fill: 'white' } }
        // });
        //
        // this.graph.addCell(rect);

    },


});
