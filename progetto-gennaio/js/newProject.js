$(document).ready(function(){
    // the "href" attribute of .modal-trigger must specify the modal ID that wants to be triggered
    $('.modal-trigger').leanModal({
        dismissible: true,
        height: '100%',
    });
    
    $('.tooltipped').tooltip({delay: 50});
    
});

function MyDiagram(elementContainer){
    
    this.graph = new joint.dia.Graph;
    this.paper = new joint.dia.Paper({
        el: elementContainer,
        width: '100%',
        height: 500,
        model: this.graph,
        gridSize: 1
    });
}

MyDiagram.prototype = {
    constructor: MyDiagram,
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

function createUmlLink(from, to, type){
    switch(type){
        case "aggregation":
            return new joint.shapes.uml.Aggregation({
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


var App = blocks.Application();

var Activity = App.Model({
    nome: blocks.observable(""),
    isAttiva: blocks.observable(false),
    dia: blocks.observable(),
    recs: blocks.observable([]),
    
    toggleAttiva: function() {
        this.isAttiva(!this.isAttiva());
    },
    
    setAttiva: function(){
        var elenco = App.NewProject.activities;
        for(i=0; i< elenco().length; i++){
            if(elenco()[i].isAttiva()){
                elenco()[i].toggleAttiva();
            }
        }
        
        this.toggleAttiva();    
        this.createActivityDiagram();
        App.NewProject.currentActivity = this;
        App.NewProject.updateDiagram();
        
    },
    
    createActivityDiagram: function(){
        // this.recs.removeAll();
        // App.NewProject.recsID.removeAll();
        this.dia = ((this.dia instanceof MyDiagram) ? this.dia : new MyDiagram($('#'+this.nome)));
        
        if(this.dia instanceof MyDiagram){
            
            if(this.dia.graph.attributes.cells.length == 0){
                var r = AndroidRect(0,0, this.nome(), 'activity');
                
                // App.NewProject.recsID.add({id: r.id, name: this.nome()});
                this.recs.add(r); 
            }

        }
        location.href = "#"+this.nome;
    },
    
});

var Activities = App.Collection(Activity);


App.View('NewProject', {
    activities: Activities(),
    currentActivity: Activity(),
    recsID: blocks.observable([]),

    activitiesEmpty: blocks.observable(function(){
        return this.activities().length == 0;
    }),
    
    newActivity: function(){
        this.currentActivity = Activity({
            nome: $('#inputActivityName').val(),
            dia: null,
            
        });
        this.currentActivity.setAttiva();
        
        this.activities.add(this.currentActivity);
        $('#inputActivityName').val('');
        
        
    },
    
    openAndroidComponentModal: function(){
        $('select').material_select();
        $('#' + this.currentActivity.nome + 'NewAndroidComponentModal').openModal();  
    },
    openCustomClassModal: function(){
        $('select').material_select();
        $('#' + this.currentActivity.nome + 'NewCustomClassModal').openModal();
    },


    addCustomClassTo: function(){
        var rectName = $('#' + this.currentActivity.nome() + 'CustomClassName').val();
        var rectType = $('#' + this.currentActivity.nome() + 'CustomClassType').find(":selected").attr('id');
        var relationType = $('#' + this.currentActivity.nome() + 'CustomClassRelationType').find(":selected").attr('id');
        var parentId = $('#' + this.currentActivity.nome() + 'CustomClassParentName').find(":selected").attr('id');
        
        var rectDefinition = {
            position: { x:300  , y: 300 },
            size: { width: 260, height: 100 },
            name: rectName,
            attrs: {
                '.uml-class-name-rect': {
                    fill: '#68ddd5',
                    stroke: '#ffffff',
                    'stroke-width': 0.5
                },
                '.uml-class-attrs-rect, .uml-class-methods-rect': {
                    fill: '#9687fe',
                    stroke: '#fff',
                    'stroke-width': 0.5
                },
                '.uml-class-methods-text, .uml-class-attrs-text': {
                    fill: '#fff'
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
        
        this.currentActivity.recs.add(rect);
        this.recsID.add({id:rect.id,name:rectName});
        this.updateDiagram();
        
        var link = createUmlLink(rect.id, parentId, relationType );
        this.currentActivity.dia.graph.addCell(link);
        
        $('select').material_select();
      
    },
    
    addAndroidComponentTo: function(){
        
        var rectName = $('#' + this.currentActivity.nome() + 'ComponentName').val();
        var rectType = $('#' + this.currentActivity.nome() + 'ComponentType').find(":selected").attr('id');
        var relationType = $('#' + this.currentActivity.nome() + 'ComponentRelationType').find(":selected").attr('id');
        var parentId = $('#' + this.currentActivity.nome() + 'ComponentParentName').find(":selected").attr('id');

        var rect = AndroidRect(0,0, rectName, rectType); 
        this.currentActivity.recs.add(rect);
        this.recsID.add({id:rect.id,name:rectName});
        this.updateDiagram();
         
        // var link = new joint.shapes.uml.Generalization({
        //     source:{id: rect.id},
        //     target:{id: this.currentActivity.recs()[0].id}
        // });

        var link = createUmlLink(rect.id, parentId, relationType );
        this.currentActivity.dia.graph.addCell(link);
        
        $('select').material_select();
        
    },
    
    updateDiagram: blocks.observable(function(){
        
        this.recsID.removeAll();
        
        for(var i=0; i< this.currentActivity.recs().length;i++){
            if(this.currentActivity.recs()[i].attributes.name){

                this.recsID.add({
                        id: this.currentActivity.recs()[i].id, 
                        name:this.currentActivity.recs()[i].attributes.name
                    });    
            }
        }
        this.currentActivity.dia.graph.addCells(this.currentActivity.recs());
    }),
});