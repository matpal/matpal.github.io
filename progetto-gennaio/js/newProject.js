/* global blocks */
/* global joint */
/* global $ */
$(document).ready(function(){
    // the "href" attribute of .modal-trigger must specify the modal ID that wants to be triggered
    $('.modal-trigger').leanModal({
        dismissible: true,
        height: '100%',
    });
    
    $('.tooltipped').tooltip({delay: 50});
    
});


var App = blocks.Application();

var Activity = App.Model({
    nome: blocks.observable(""),
    isAttiva: blocks.observable(false),
    paper: blocks.observable(),
    recs: blocks.observable([]),
        
    toggleAttiva: function() {
        this.isAttiva(!this.isAttiva());
    },
    
    setAttiva: function(){
        var elenco = App.NewProject.activities;
        for(var i=0; i< elenco().length; i++){
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
        this.paper = ((this.paper instanceof MyPaper) ? this.paper : new MyPaper($('#'+this.nome)));
        
        if(this.paper instanceof MyPaper){
            if(this.paper.graph.attributes.cells.length == 0){
                var r = AndroidRect(0,0, this.nome(), 'activity');

                this.recs.add(r); 
            }
        }
        location.href = "#"+this.nome;
    },
    
    showMenu: function(){
        var fn = App.NewProject.openModalFromContextMenu;
        var opt = {}
        
        if(this.paper.graph.attributes.cells.length < 2){
            opt = {
                'Add Android Component': fn,
                'Add Custom Class': fn,
            }
        }else{
            opt = {
                'Add Android Component': fn,
                'Add Custom Class': fn,
                'Add Relation' : fn
            }
        }
        
        $('#'+this.nome).contextmenu(opt, 'right');  
    },
});

var Activities = App.Collection(Activity);


App.View('NewProject', {
    activities: Activities(),
    currentActivity: Activity(),
    // recsID: blocks.observable([]),

    activitiesEmpty: blocks.observable(function(){
        return this.activities().length == 0;
    }),
    
    newActivity: function(){
        this.currentActivity = Activity({
            nome: $('#inputActivityName').val(),
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
    openCustomLinkModal: function(){
        $('select').material_select();
        $('#' + this.currentActivity.nome + 'NewCustomLinkModal').openModal();
    },
    
    openModalFromContextMenu: function(evt,parent){
               
        switch(evt.target.textContent){
            
            case "Add Relation":  
                this.openCustomLinkModal();
                break;
                
            case "Add Custom Class":
                this.openCustomClassModal();
                break;
                
                
            case "Add Android Component":
                this.openAndroidComponentModal();
                break;
        }
    },


    addCustomClassTo: function(){
        createCustomClass(this);
    },
    
    addAndroidComponentTo: function(){
        createAndroidComponent(this);
    },
    
    addCustomLink: function(){
       createCustomLink(this);
    },
    
    updateDiagram: blocks.observable(function(){
        this.currentActivity.paper.graph.addCells(this.currentActivity.recs());
    }),
});