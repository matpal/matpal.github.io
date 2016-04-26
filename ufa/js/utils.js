// FUNCTIONS



// CLASSES

function MyPaper(elementContainer, width){
    var self = this;
    this.graph = new joint.dia.Graph;
    var calcWidth = width || window.innerWidth * 0.75;
    this.paper = new joint.dia.Paper({
        el: elementContainer,
        width: calcWidth,
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

    this.paper.on('cell:pointerup', function(cellView, evt, x, y){
        if (V(evt.target).hasClass('del')) {

            var view = App.ModelingApplication || App.ModelingActivities;
            if(view){
                var current = view.currentActivity;
            }else{
                var current = App.ModelingApplication;
            }

            var elem = cellView.model;



            elem.remove({disconnectLinks: false});
            // current.recs.removeAll();

            var cellType = elem.attributes.prop.data.type;

            if(cellType == "activity"){
                var index = -1;
                for(var i = 0; i< view.activities().length; i ++){
                    if(view.activities()[i].nome == elem.attributes.name){
                        index = i;
                    }
                }
                view.activities.removeAt(index);
            }
            if(cellType == "service"){
                var index = -1;
                for(var i = 0; i< view.services().length; i ++){
                    if(view.services()[i].nome == elem.attributes.name){
                        index = i;
                    }
                }
                view.services.removeAt(index);
            }
            if(cellType == "contentProvider"){
                var index = -1;
                for(var i = 0; i< view.providers().length; i ++){
                    if(view.providers()[i].nome == elem.attributes.name){
                        index = i;
                    }
                }
                view.providers.removeAt(index);
            }
            if(cellType == "broadcastReceiver"){
                var index = -1;
                for(var i = 0; i< view.receivers().length; i ++){
                    if(view.receivers()[i].nome == elem.attributes.name){
                        index = i;
                    }
                }
                view.receivers.removeAt(index);
            }



            // if(elem.attributes.prop.data.type === 'layout' || elem.attributes.prop.data.type ==='widget'){
            //     var index = -1;
            //     for(var i = 0; i< current.recsLayout().length; i++){
            //         if(current.recsLayout()[i].id == elem.id){
            //             index = i;
            //         }
            //     }
            //     current.recsLayout.removeAt(index);
            //     current.recsLayout.removeAt(index); // serve per eliminare il link
            // }else{
            //
            //     var index = -1;
            //     for(var i = 0; i< current.recsJava().length; i++){
            //         if(current.recsJava()[i].id == elem.id){
            //             index = i;
            //         }
            //     }
            //     current.recsJava.removeAt(index);
            //     current.recsJava.removeAt(index); // serve per eliminare il link
            // }



            // current.recsName.removeAll();

            // current.recs(current.paper.graph.getCells());
            current.populateRecsJava();
            current.populateRecsLayout();

            current.populateRecsName();
            view.updateDiagram();
            // graphLayout.prepare().layout();
        }
    });
}

MyPaper.prototype = {
    constructor: MyPaper,
}


function AndroidRect(xPos,yPos, name, type, imgPath, from){
    return new joint.shapes.uml.AndroidComponent({
                    // position: { x:xPos  , y: yPos },
                    size: { width: name.length*10+52, height: 100 },
                    name: name,
                    content: ['...'],
                    prop:{
                        data: {'type' : type}
                    },
                    attrs: {
                        image:{
                            'xlink:href' : imgPath
                        },
                        group: {'group': from},
                    }
                });
}

function AndroidApp(xPos,yPos, name, type, imgPath, from){
    return new joint.shapes.uml.AndroidApplication({
                    size: { width: name.length*10+52, height: 100 },
                    name: name,
                    content: [],
                    prop:{
                        data: {'type' : type}
                    },
                    attrs: {
                        image:{
                            'xlink:href' : imgPath
                        },
                        group: {'group': from},
                    }
                });
}

// FUNCTIONS
function searchArrayOfObj(arrayObj, arrayProp, element){
    for(var i = 0; i < arrayObj.length; i++){
        if(arrayObj[i][arrayProp]() === element){
            return arrayObj[i];
        }
    }
}

function createUmlLink(from, to, type){
    var routerType = {name: 'manhattan'};
    var connectorType = {name: 'normal'};
    switch(type){
        case "aggregation":
            return new joint.shapes.uml.Aggregation({
                source: {id: from},
                target: {id: to},
                router: routerType,
                connector: connectorType,
            });
            break;
        case "association":
            return new joint.shapes.uml.Association({
                source: {id: from},
                target: {id: to},
                router: routerType,
                connector: connectorType,
            });
            break;
        case "composition":
            return new joint.shapes.uml.Composition({
                source: {id: from},
                target: {id: to},
                router: routerType,
                connector: connectorType,
            });
            break;
        case "generalization":
            return new joint.shapes.uml.Generalization({
                source: {id: from},
                target: {id: to},
                router: routerType,
                connector: connectorType,
            });
            break;
        case "implementation":
            return new joint.shapes.uml.Implementation({
                source: {id: from},
                target: {id: to},
                router: routerType,
                connector: connectorType,
            });
            break;
        default:
            console.log("UML Link not valid");
            return null;
    }
}

function createAndroidComponent(obj,rectName, rectType,parentName,relType){
        var myRectName = rectName || $('#' + obj.currentActivity.nome() + 'ComponentName').val();
        var myRectType = rectType || $('#' + obj.currentActivity.nome() + 'ComponentType').find(":selected").attr('id');
        var myRelationType = relType || $('#' + obj.currentActivity.nome() + 'ComponentRelationType').find(":selected").attr('id');

        // var myParentName = parentName || $('#' + obj.currentActivity.nome() + 'ComponentParentName').find(":selected");

        var activityFound = searchArrayOfObj(obj.activities(),"id", parentName);
        var idRect = "";
        // for(var i = 0; i < obj.activities().length; i++){
        //     for(var j= 0; j < obj.activities()[i].recs().length; j++){
        //         if(obj.activities()[i].recs()[j].id == activityFound.recs()[0].id){
        //             console.log(obj.activities()[i].nome());
        //         }
        //     }
        // }
        if(activityFound){
            activityFound.setAttiva();
            // idRect = activityFound.recsJava()[0].id;
            idRect = activityFound.paper.graph.getCells()[0].id;
        }else{
            // idRect = activityFound.paper.graph.getCells()[0].id;
            console.log("non ho trovato l'activity con nome " +parentName);
        }

        var parentId =  idRect || $('#' + obj.currentActivity.nome() + 'ComponentParentName').find(":selected").attr('id');

        var rect = AndroidRect(0,0, myRectName, myRectType,AndroidComponents[myRectType].icon);
        if(myRectType === 'widget' || myRectType === 'layout'){
            obj.currentActivity.recsLayout.add(rect);
        }else{
            obj.currentActivity.recsJava.add(rect);
        }

        obj.updateDiagram();

        var link = createUmlLink(rect.id, parentId, myRelationType );
        if(myRectType === 'widget' || myRectType === 'layout'){
            obj.currentActivity.recsLayout.add(link);
        }else{
            obj.currentActivity.recsJava.add(link);
        }
        obj.updateDiagram();
        // obj.currentActivity.paper.graph.addCell(link);
        console.log("Creato componente android: " + myRectName + " " + myRectType + " " + myRelationType);
        $('select').material_select();


        return {"rect":rect,"link":link};
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
            prop:{
                data: {'type' : rectType}
            },
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
                var rect = new joint.shapes.uml.CustomClass(rectDefinition);
                break;
            case "interface":
                var rect = new joint.shapes.uml.Interface(rectDefinition);
                break;
        }

        obj.currentActivity.recsJava.add(rect);
        // obj.currentActivity.paper.graph.addCell(rect);


        // obj.recsID.add({id:rect.id,name:rectName});
        obj.updateDiagram();

        var link = createUmlLink(rect.id, parentId, relationType );
        // obj.currentActivity.paper.graph.addCell(link);
        obj.currentActivity.recsJava.add(link);
        obj.updateDiagram();
        $('select').material_select();
}
