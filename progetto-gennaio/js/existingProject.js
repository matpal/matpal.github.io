/* global blocks */
/* global $ */
/* global createCustomLink */
/* global createCustomClass */
/* global createAndroidComponent */
/* global searchArrayOfObj */
$(document).ready(function() {

  $(".button-collapse").sideNav({
      menuWidth: 350,
  });


  // close sideNav on click
  $('#dropActivityMenu').click(function(){
      $('.button-collapse').sideNav('hide');
  });

  //   Modal 

  $('.modal-trigger').leanModal({
      dismissible: true,
      height: '100%',
  });
  $('#androidManifestModal').openModal();
   
});


var App = blocks.Application();
var TEMP_FILE_CONTENT = "";
var TEMP_FILE_NAME = "";


function searchForIntents(inputString){
    var lines = inputString.split('\n');
    var regola = /\w*\s*=\s*new Intent\w*/;
    var regola2 = /\w*.class/;
    var tempResult = [];
    var result = [];
    var intentName="", intentType = "implicitIntent";
    
    for(var i= 0; i< lines.length; i++){
        if(lines[i].match(regola)){
            tempResult.push(lines[i].trim().split(' '));
        }
    }
    console.log(tempResult);
    for(var i= 0; i< tempResult.length; i++){
        for(var j= 0; j< tempResult[i].length; j++){
            intentType = "implicitIntent";
            if (tempResult[i][j] === 'Intent'){
                intentName = tempResult[i][j+1];
            }
            // if (tempResult[i][j].match(new RegExp('/\w*.class/'))){
            if (tempResult[i][j].match(regola2)){
                // intentName = tempResult[i][j].split('.')[0];
                var word = tempResult[i][j];
                intentName = word.substring(word.lastIndexOf(",")+1, word.lastIndexOf("."));
                intentType= "explicitIntent";
            }   
        }
        result.push({name: intentName, type: intentType});
    }
    
    return result;
}

function searchForServices(inputString){
    var lines = inputString.split('\n');
    var regola1 = /\w*startService\w*/;
    var regola2 = /\w*bindService\w*/;
    var temp = [];
    var result = [];
    
    for(var i = 0; i < lines.length; i++ ){
        if(lines[i].match(regola1) || lines[i].match(regola2)){
            temp.push(lines[i].trim().split(' '));
        }
    }
    
    var regola= /\w*.class/;
    for(var i = 0; i < temp.length; i++ ){
        for(var j = 0; j < temp[i].length; j++){
            if(temp[i][j].match(regola)){
                result.push(temp[i][j].trim().split('.')[0]);
            }    
        }
    }
    
    return result;
}

function searchForReceivers(inputString){
    var lines = inputString.split('\n');
    var regola1 = /\w*\.sendBroadcast\w*/;
    var regola2 = /\w*\.sendStickyBroadcast\w*/;
    var temp = [];
    var result = [];
    
    // cerca le righe che fanno match con le regole
    for(var i = 0; i < lines.length; i++ ){
        if(lines[i].match(regola1) || lines[i].match(regola2)){
            temp.push(lines[i].trim().split(' '));
        }
    }
    
    // estrapola il nome della classe e lo aggiunge all'array result 
    for(var i = 0; i < temp.length; i++ ){
        for(var j = 0; j < temp[i].length; j++){
            if(temp[i][j].match(regola1) || temp[i][j].match(regola2)){
                result.push(temp[i][j].trim().split('.')[0]);
            }    
        }
    }
    
    return result;
}

function searchForContentProviders(inputString){
    var lines = inputString.split('\n');
    var regola1 = /\w*\.getContentResolver\w*/;
    var temp = [];
    var result = [];
    
    for(var i = 0; i < lines.length; i++ ){
        if(lines[i].match(regola1)){
            temp.push(lines[i].trim().split(' '));
        }
    }
    
    for(var i = 0; i < temp.length; i++ ){
        for(var j = 0; j < temp[i].length; j++){
            if(temp[i][j].match(regola1)){
                result.push("Content Provider");
            }    
        }
    }
    
    return result;
}

function searchFor(inputString, regExpr){
        var lines = inputString.split('\n');

        for(var i=0; i < lines.length; i++){
            if(lines[i].match(regExpr)){
                var words = lines[i].trim().split(' ');
                return words;
            }
        }
        return null;
}


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

var Messages = App.Model({
    error : blocks.observable(""),
    layoutFile: blocks.observable(""),
    javaFile: blocks.observable("")
});


var Activity = App.Model({
    nome : blocks.observable(),
    isAttiva: blocks.observable(false),
    messages: Messages(),
    paper: blocks.observable(),
    
    layoutFile: blocks.observable(),
    layoutFileUploaded: blocks.observable(false),
    javaFile: blocks.observable(),
    javaFileUploaded: blocks.observable(false),
    
    recs: blocks.observable([]),

    toggleAttiva: function() {
        this.isAttiva(!this.isAttiva());
    },
    
    createActivityDiagram: function(){
        this.paper = ((this.paper instanceof MyPaper) ? this.paper : new MyPaper($('#'+this.nome)));
        
        if(this.paper instanceof MyPaper){

            if(this.paper.graph.attributes.cells.length == 0){
                var r = AndroidRect(0,0, this.nome(), 'activity');
                this.recs.add(r);
            //    this.dia.graph.addCells(this.recs()); 
            }
            
        }
        location.href = '#' + this.nome;
    },

    setAttiva: function(){
        var activityNames = App.ExistingProject.activities;
        for(var i=0; i< activityNames().length; i++){
            if(activityNames()[i].isAttiva()){
                activityNames()[i].toggleAttiva();
            }
        }
        
        
        this.toggleAttiva();    
        this.createActivityDiagram();
        App.ExistingProject.currentActivity = this;
        App.ExistingProject.updateDiagram();
        
    },
    
    showMenu: function(){
      var fn = App.ExistingProject.openModalFromContextMenu;
      var elem = $('#'+this.nome);
      var opt = {};
       
      if(this.paper.graph.attributes.cells.length < 2){
          opt = {
            'Add Android Component': fn,
            'Add Custom Class': fn,
          }
      }else{
          opt = {
            'Add Android Component': fn,
            'Add Custom Class': fn,
            'Add Relation' : fn,
          }
      }
      
      elem.contextmenu(opt, 'right');  
    },   
    
   
    loadJavaFile: function(evt){
        var file = document.getElementById("javaFile"+this.nome()).files[
            0];
        var fileType = /\.java$/;
        
        this.messages.javaFile("");
        
        if (file) {

            if (file.name.match(fileType)) {
                var reader = new FileReader();
                var cb = function(data,filename) {
                    TEMP_FILE_CONTENT = data;
                    TEMP_FILE_NAME = filename;
                }

                reader.onload = function(e) {
                    $.when(
                        cb(e.target.result, file.name)
                    ).then(
                        function(){
                            var curActivity = this.App.ExistingProject.currentActivity; 
                            var r = null;
                            var link = null;
                            
                            curActivity.javaFile(TEMP_FILE_CONTENT);
                            curActivity.javaFileUploaded(true);
                            
                            var servicesFound = searchForServices(curActivity.javaFile());
                            if(servicesFound){
                                for (var i = 0; i < servicesFound.length; i++) {
                                    r = AndroidRect( 10,10,servicesFound[i],'service'); 
                                    curActivity.recs.add(r);
                                    App.ExistingProject.updateDiagram();
                                     
                                    //  Crea funzione update "linked" per servizi,providers,ecc
                                    // for(var t= 0; t< App.ExistingProject.services().length; t++){
                                    //     if(App.ExistingProject.services()[t].nome() == servicesFound[i]){
                                    //         App.ExistingProject.services()[t].linked(true);
                                    //     }
                                    // }
                                    App.ExistingProject.services().forEach(function(element){
                                        if(element.nome() == servicesFound[i]){
                                            element.linked(true);
                                        }
                                    });
                                    
                                    link = createUmlLink(r.id, curActivity.recs()[0].id, "association" );
                                    curActivity.paper.graph.addCell(link);
                                }    
                            }
                            
                            
                            var intentsFound = searchForIntents(curActivity.javaFile());
                            if(intentsFound){
                                for (var i = 0; i < intentsFound.length; i++) {
                                    r = AndroidRect( 10,10,intentsFound[i].name,intentsFound[i].type); 
                                    curActivity.recs.add(r);
                                    App.ExistingProject.updateDiagram();
                                    
                                    link = createUmlLink(r.id, curActivity.recs()[0].id, "association" );
                                    curActivity.paper.graph.addCell(link);
                                        
                                }    
                            }
                            
                            
                            var receiversFound = searchForReceivers(curActivity.javaFile());
                            if(receiversFound){
                                for (var i = 0; i < receiversFound.length; i++) {
                                    r = AndroidRect( 10,10,receiversFound[i],'broadcastReceiver'); 
                                    curActivity.recs.add(r);
                                    App.ExistingProject.updateDiagram();
                                    
                                    App.ExistingProject.receivers().forEach(function(element){
                                        if(element.nome() == receiversFound[i]){
                                            element.linked(true);
                                        }
                                    });
                                    
                                    link = createUmlLink(r.id, curActivity.recs()[0].id, "association" );
                                    curActivity.paper.graph.addCell(link);
                                        
                                }    
                            }
                            
                            
                            var providersFound = searchForContentProviders(curActivity.javaFile());
                            if( providersFound ){
                                for (var i = 0; i < providersFound.length; i++) {
                                    r = AndroidRect( 10,10,providersFound[i],'contentProvider'); 
                                    curActivity.recs.add(r);
                                    App.ExistingProject.updateDiagram();
                                    
                                    App.ExistingProject.providers().forEach(function(element){
                                        if(element.nome() == providersFound[i]){
                                            element.linked(true);
                                        }
                                    });
                                    
                                    link = createUmlLink(r.id, curActivity.recs()[0].id, "association" );
                                    curActivity.paper.graph.addCell(link);
                                        
                                }
                            }
                            
                        }
                    );

                }

                reader.readAsText(file);
                
                
            } else {
                this.layoutFileUploaded(false);
                this.messages.javaFile("This is not a valid JAVA file.");
            }
        } else {
            this.messages.javaFile("Can't open file.");
        }
    },
    
    loadLayoutFile: function(evt){
        var file = document.getElementById("layoutFile"+this.nome()).files[
            0];
        var fileType = /\.xml$/;
        
        this.messages.layoutFile("");
        
        if (file) {

            if (file.name.match(fileType)) {
                var reader = new FileReader();
                var cb = function(data,filename) {
                    TEMP_FILE_CONTENT = data;
                    TEMP_FILE_NAME = filename;
                }

                reader.onload = function(e) {
                    $.when(
                        cb(e.target.result, file.name)
                    ).then(
                        function(){
                            var curActivity = this.App.ExistingProject.currentActivity; 
                            curActivity.layoutFileUploaded(true);
                            curActivity.layoutFile(TEMP_FILE_CONTENT);
                            curActivity.parseLayoutForComponents();
                            this.App.ExistingProject.updateDiagram();
                        }
                    );

                }

                reader.readAsText(file);
                
                
            } else {
                this.layoutFileUploaded(false);
                this.messages.layoutFile("This is not a valid XML file.");
            }
        } else {
            this.messages.layoutFile("Can't open file.");
        }
    },
    
    parseLayoutTree: function(nodo, parent){
        var rectType = "noicon";
        if (layouts.indexOf(nodo.prop("tagName")) >= 0 ){
            rectType = "layout";
        }
        if (widgets.indexOf(nodo.prop("tagName")) >= 0){
            rectType = "widget";
        }
        var father = AndroidRect(
                    0,0, 
                    nodo.attr("android:id") ? 
                    nodo.attr("android:id").split('/').pop() : nodo.prop("tagName"), 
                    rectType 
                );
        this.recs.add(father);
        App.ExistingProject.updateDiagram();
        var link = createUmlLink(father.id, parent.id, "association" );
        this.paper.graph.addCell(link);
        
        var nodes = nodo.children('*');
        for(var i=0; i< nodes.length; i++){
            var n = $(nodes[i]);
            rectType = "noicon";
            
            if (layouts.indexOf(n.prop("tagName")) >= 0 ){
                rectType = "layout";
            }
            if (widgets.indexOf(n.prop("tagName")) >= 0){
                rectType = "widget";
            }
            
            var r = AndroidRect(
                    0,0, 
                    n.attr("android:id") ? 
                    n.attr("android:id").split('/').pop() : n.prop("tagName"), 
                    rectType 
                );
            
            this.recs.add(r);
            App.ExistingProject.updateDiagram();
            
            // creo link,  r.id -----> father.id
            link = createUmlLink(r.id, father.id, "association" );
            this.paper.graph.addCell(link);
            
            // se il nodo ha figli...
            if(n.children().length > 0 ){
                this.parseLayoutTree(n.children('*'), r);
            }
        }
        
        
    },
    
    
    parseLayoutForComponents: function(){
        var xmlDoc = $.parseXML(this.layoutFile());
        var $xml = $(xmlDoc);
        var root = $xml.children().first();
        
        this.parseLayoutTree(root, this.recs()[0]);
    },


});

var Service = App.Model({
    nome: blocks.observable(),
    linked: blocks.observable(false),
});

var Provider = App.Model({
    nome : blocks.observable(),
    linked: blocks.observable(false),
});

var Receiver = App.Model({
    nome : blocks.observable(),
    linked: blocks.observable(false),
});


// Collections

var Activities = App.Collection(Activity);
var Services = App.Collection(Service);
var Providers = App.Collection(Provider);
var Receivers = App.Collection(Receiver);


/*
 *
 *  VIEWS
 *
 */

App.View('ExistingProject', {
    messages: Messages(),
    manifest: AndroidManifest(),
   
    activities : Activities(),
    currentActivity: Activity(),
    services : Services(),
    providers: Providers(),
    receivers: Receivers(),
    
    diagram : blocks.observable(),

    
    activitiesEmpty: blocks.observable(function(){
        return this.activities().length == 0;
    }),
    servicesEmpty: blocks.observable(function(){
        return this.services().length == 0;
    }),
    providersEmpty: blocks.observable(function(){
        return this.providers().length == 0;
    }),
    receiversEmpty: blocks.observable(function(){
        return this.receivers().length == 0;
    }),
    

    loadAndroidManifest: function(evt) {
        // var self = this;
        // console.log("Self is "+ self);
        var file = document.getElementById("AndroidManifestUploadButton").files[
            0];

        if (file) {

            if (file.name === 'AndroidManifest.xml') {
                var reader = new FileReader();
                var cb = function(data,filename) {
                    TEMP_FILE_CONTENT = data;
                    TEMP_FILE_NAME = filename;
                }

                reader.onload = function(e) {
                    $.when(
                        cb(e.target.result, file.name)
                    ).then(
                        function(){
                            var view = this.App.ExistingProject;
                            view.storeManifest();
                            view.manifest.uploaded(true);
                            
                            view.activities.removeAll();
                            view.services.removeAll();
                            view.providers.removeAll();
                            view.receivers.removeAll();
                            
                            var listaAttivita = view.getComponent('activity');
                            for(var i=0; i< listaAttivita.length; i++){
                                
                                var newActivity = Activity({
                                    nome: listaAttivita[i],
                                    isAttiva:false,
                                    
                                });

                                view.activities.add(newActivity);
                            }

                            var listaServizi = view.getComponent('service');
                            listaServizi.forEach(function(e,i){
                                var newService = Service({
                                    nome : e,
                                });
                                view.services.add(newService);
                            });
                             
                            var listaProviders = view.getComponent('provider');
                            for(var i=0; i< listaProviders.length; i++){
                                
                                var newProvider = Provider({
                                    nome: listaProviders[i],
                                    
                                });

                                view.providers.add(newProvider);
                            }
                            
                            var listaReceivers = view.getComponent('receiver');
                            for(i=0; i< listaReceivers.length; i++){
                                
                                var newReceiver = Receiver({
                                    nome: listaReceivers[i],
                                    
                                });

                                view.receivers.add(newReceiver);
                            }
                            
                            
                            
                            $('#androidManifestModal').closeModal();
                            
                        }
                    );

                }

                reader.readAsText(file);

                console.log("Name: " + file.name + "\n" +
                    "Last Modified Date :" + file.lastModifiedDate
                );

            } else {
                this.messages.error("This is not a valid AndroidManifest file.");
            }
        } else {
            this.messages.error("Can't open file.");
        }


    },
    
     uploadAndroidManifest: function(evt) {
        this.loadAndroidManifest();
    },
    
    

    storeManifest: function(evt) {
        this.manifest.fileName(TEMP_FILE_NAME);
        this.manifest.fileContent(TEMP_FILE_CONTENT);
    },

    getComponent: function(component){
        var xmlDoc = $.parseXML(this.manifest.fileContent());
        var $xml = $(xmlDoc);
        var componentNameList = $xml.find(component);

        var names = [];

        componentNameList.each(function(){
            names.push($(this).attr("android:name").split('.').pop());
        });

        return names;
    },


    updateDiagram: blocks.observable(function(){
        this.currentActivity.paper.graph.addCells(this.currentActivity.recs());
    }),

    openModalFromContextMenu: function(evt, parent){
        $('select').material_select();

        switch(evt.target.textContent){
            
            case "Add Relation":  
                if(this.currentActivity.recs().length >1){
                    $('#' + this.currentActivity.nome + 'NewCustomLinkModal').openModal();    
                }else{
                    console.log("C'è solo un diagramma, impossibile aggiungere una relazione");
                }
                break;
                
                
            case "Add Custom Class":
                $('#' + this.currentActivity.nome + 'NewCustomClassModal').openModal();
                break;
                
                
            case "Add Android Component":
                $('#' + this.currentActivity.nome + 'NewAndroidComponentModal').openModal();
                break;
        }
        
    },
    
    openAttachComponentModal: function(evt){
        $('select').material_select();
        
        var element = document.getElementById(evt.target.text+"AttachModal");
        $(element).openModal();
    },
    attachService: function(evt){
        var element = null;
        var rectName = evt.target.attributes.parentName.value;
        
        // for(var t= 0; t< this.services().length;t++){
        //     if(this.services()[t].nome == rectName){
        //         this.services()[t].linked(true);
        //     }
        // }
        

        element = document.getElementById(rectName + 'UnattachedServiceRelationType');
        var relationType = $(element).find(":selected").attr('id');
       
        element = document.getElementById(rectName + 'UnattachedServiceParentName');
        var parentName = $(element).find(":selected").attr('id');
        
        
        var rect = AndroidRect(0,0, rectName, "service"); 
        
        searchArrayOfObj(this.activities(),"nome", parentName).setAttiva();
                
        
        this.currentActivity.recs.add(rect);
        this.updateDiagram();
        
        
        var link = createUmlLink(rect.id, this.currentActivity.recs()[0],relationType);
        this.currentActivity.paper.graph.addCell(link);
        
        searchArrayOfObj(this.services(),"nome",rectName).linked(true);
        $('select').material_select(); 
    },
    attachProvider: function(evt){
        var element = null;
        var rectName = evt.target.attributes.parentName.value;
        
        
        

        element = document.getElementById(rectName + 'UnattachedProviderRelationType');
        var relationType = $(element).find(":selected").attr('id');
       
        element = document.getElementById(rectName + 'UnattachedProviderParentName');
        var parentName = $(element).find(":selected").attr('id');
        
        
        var rect = AndroidRect(0,0, rectName, "contentProvider"); 
        
        searchArrayOfObj(this.activities(),"nome", parentName).setAttiva();
        
        this.currentActivity.recs.add(rect);
        this.updateDiagram();
        
       
        var link = createUmlLink(rect.id, this.currentActivity.recs()[0],relationType);
        this.currentActivity.paper.graph.addCell(link);
        
        searchArrayOfObj(this.providers(),"nome",rectName).linked(true);
        $('select').material_select(); 
    },
    attachReceiver: function(evt){
        var element = null;
        var rectName = evt.target.attributes.parentName.value;
        
        
        

        element = document.getElementById(rectName + 'UnattachedReceiverRelationType');
        var relationType = $(element).find(":selected").attr('id');
       
        element = document.getElementById(rectName + 'UnattachedReceiverParentName');
        var parentName = $(element).find(":selected").attr('id');
        
        
        var rect = AndroidRect(0,0, rectName, "broadcastReceiver"); 
        
        searchArrayOfObj(this.activities(),"nome", parentName).setAttiva();
        
        this.currentActivity.recs.add(rect);
        this.updateDiagram();
        
       
        var link = createUmlLink(rect.id, this.currentActivity.recs()[0],relationType);
        this.currentActivity.paper.graph.addCell(link);
        
        searchArrayOfObj(this.receivers(),"nome",rectName).linked(true);
        $('select').material_select(); 
    },
    
    addAndroidComponentTo: function(){
        createAndroidComponent(this);
    },
    
    addCustomClassTo: function(){
        createCustomClass(this);
    },
    
    addCustomLink: function(){
       createCustomLink(this);       
    },

});
