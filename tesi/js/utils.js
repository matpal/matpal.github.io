/* global MyPaper */
/* global AndroidRect */
/* global createUmlLink */
// DATA


// FUNCTIONS

function searchArrayOfObj(arrayObj, arrayProp, element){
    for(var i = 0; i < arrayObj.length; i++){
        if(arrayObj[i][arrayProp]() === element){
            return arrayObj[i];
        }
    }
}

// CLASSES

function MyPaper(elementContainer){
    var self = this;
    this.graph = new joint.dia.Graph;
    var calcWidth = window.innerWidth * 0.75;
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

            var view = App.NewProject || App.ExistingProject;
            var current = view.currentActivity;
            cellView.model.remove({disconnectLinks: false});
            current.recs.removeAll();
            current.recsName.removeAll();
            current.recs(current.paper.graph.getCells());
            current.populateRecsName();
            // graphLayout.prepare().layout();
        }
    });
}



MyPaper.prototype = {
    constructor: MyPaper,
}

function AndroidRect(xPos,yPos, name, type, from){
    return new joint.shapes.uml.AndroidComponent({
                    // position: { x:xPos  , y: yPos },
                    size: { width: name.length*10+52, height: 100 },
                    name: name,
                    content: ['...'],
                    // prop:{
                    //     data: {'group' : group}
                    // },
                    attrs: {
                        image:{
                            'xlink:href' : AndroidComponents[type].icon
                        },
                        group: {'group': from},
                    }
                });
}
// FUNCTIONS
function createUmlLink(from, to, type){
    var routerType = {name: 'manhattan'};
    var connectorType = {name: 'rounded'};
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
        var activityFound = searchArrayOfObj(obj.activities(),"nome", parentName);
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
            idRect = activityFound.recs()[0].id;
        }

        var parentId =  idRect || $('#' + obj.currentActivity.nome() + 'ComponentParentName').find(":selected").attr('id');

        var rect = AndroidRect(0,0, myRectName, myRectType);
        obj.currentActivity.recs.add(rect);

        obj.updateDiagram();

        var link = createUmlLink(rect.id, parentId, myRelationType );
        obj.currentActivity.paper.graph.addCell(link);
        console.log("Creato componente android: " + myRectName + " " + myRectType + " " + myRelationType);
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
                var rect = new joint.shapes.uml.CustomClass(rectDefinition);
                break;
            case "interface":
                var rect = new joint.shapes.uml.Interface(rectDefinition);
                break;
        }

        obj.currentActivity.recs.add(rect);
        // obj.currentActivity.paper.graph.addCell(rect);


        // obj.recsID.add({id:rect.id,name:rectName});
        obj.updateDiagram();

        var link = createUmlLink(rect.id, parentId, relationType );
        obj.currentActivity.paper.graph.addCell(link);

        $('select').material_select();
}
