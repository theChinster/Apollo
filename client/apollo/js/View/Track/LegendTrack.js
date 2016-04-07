define([
        'dojo/_base/declare',
        'dojo/_base/array',
        'dojo/_base/lang',
        'dojo/_base/event',
        'dojo/dom-construct',
        'dojo/dom-style',
        'JBrowse/View/Track/SVGTrackSimpleBase',
        'JBrowse/View/Track/SVG/SVGLayerCoords',
        'JBrowse/View/Track/SVG/SVGLayerBpSpace',
        'JBrowse/View/Track/SVG/SVGLayerPxSpace',
],
    function (
        declare,
        array,
        lang,
        domEvent,
        domConstruct,
        domStyle,
        SVGTrackBase,
        SVGLayerCoords,
        SVGLayerBpSpace,
        SVGLayerPxSpace
    ) {

        function numberWithCommas(x) {
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        };

        return declare(
            [ SVGTrackBase ]
            ,
            /**
             * @lends JBrowse.View.Track.LocationScale.prototype
             */
            {

                /**
                 * This track is for (e.g.) position and sequence information that should
                 * always stay visible at the top of the view.
                 * @constructs
                 */

                constructor: function (args) {//name, labelClass, posHeight) {
                    console.log(args);
                    this.loaded = true;
                    this.labelClass = args.labelClass;
                    this.posHeight = args.posHeight;
                    this.height = Math.round(args.posHeight * 1.2);
                },

                // this track has no track label or track menu, stub them out
                makeTrackLabel: function () {
                },
                makeTrackMenu: function () {
                },

                _trackMenuOptions: function(){
                },

                //_defaultConfig: function () {
                //    var thisConfig = this.inherited(arguments);
                //    thisConfig.menuTemplate = null;
                //    thisConfig.noExport = true;  // turn off default "Save track data" "
                //    //thisConfig.style.centerChildrenVertically = false;
                //    return thisConfig;
                //},
                //heightUpdate: function( height, blockIndex ) {
                //    //console.log("SVGFeatures::heightUpdate("+height+")");
                //    //console.dir(arguments);
                //    //var err = new Error();
                //    //console.log(err.stack);
                //
                //    this.inherited( arguments );
                //    if( this.svgCanvas ){
                //        //this.svgCanvas.height = this.svgCanvas.offsetHeight;
                //        console.log('has height ');
                //        this.svgCanvas.height = 100 ;
                //    }
                //    else{
                //        console.log('has height ');
                //        this.svgCanvas.height = 200 ;
                //    }
                //},

                setViewInfo: function( genomeView, heightUpdate, numBlocks, trackDiv, widthPct, widthPx, scale ) {
                    console.log("SVGLollipop::setViewInfo");
                    console.log(numBlocks+" "+widthPct+" "+widthPx+" "+scale);

                    this.inherited( arguments );

                    //this.svgCoords = new SVGLayerCoords(this);
                    //this.svgCoords.setViewInfo( genomeView, heightUpdate, numBlocks, trackDiv, widthPct, widthPx, scale );

                    this.svgSpace = new SVGLayerPxSpace(this);      // px-space svg layer
                    //this.svgSpace = new SVGLayerBpSpace(this);    // bp-space svg layer
                    this.svgSpace.setViewInfo( genomeView, heightUpdate, numBlocks, trackDiv, widthPct, widthPx, scale );

                },

                showRange: function(first, last, startBase, bpPerBlock, scale, containerStart, containerEnd) {
                    console.log("SVGLollipop::showRange");
                    console.log(first+" "+last+" "+startBase+" "+bpPerBlock+" "+scale+" "+containerStart+" "+containerEnd);

                    this.displayContext = {
                        first: first,
                        last: last,
                        startBase: startBase,
                        bpPerBlock: bpPerBlock,
                        scale: scale,
                        containerStart: containerStart,
                        containerEnd: containerEnd
                    };

                    this.svgScale = scale;

                    this.inherited(arguments);      // call the superclass's showRange

                    //this.svgCoords.showRange(first, last, startBase, bpPerBlock, scale, containerStart, containerEnd);
                    this.svgSpace.showRange(first, last, startBase, bpPerBlock, scale, containerStart, containerEnd);

                },
                /*
                 id = unique string of object
                 bpCoord = basepair coordinate of object
                 width = width of object
                 height = height of object
                 callback = function that returns object

                 */
                addSVGObject: function(id,bpCoord,width,height,callback) {

                    this.svgSpace.addSVGObject(id,bpCoord,width,height,callback);
                },
                fixId: function(val) {
                    return val.replace(",", "-");
                },
                computeHeight: function() {
                    return this.svgSpace.getHeight();
                },
                fillFeatures: function( args ) {

                    this.inherited(arguments);      // call the superclass's
                },

                //bp2Native: function(val) {
                //    return (val - this.svgParent.displayContext.startBase) * this.svgParent.displayContext.scale;
                //},

                renderGrid: function(context,fRect){
                    var thisB = this;
                    // create svg element new
                    var feature = fRect.f;

                    // draw line
                    var svgSpace = this.svgSpace;

                    // compute the x coord given the bpCoord
                    var bpCoord = feature.get("start");
                    var label = feature.get("label");
                    var color = feature.get("color");
                    var cx = svgSpace.bp2Native(bpCoord);
                    var len = (feature.get("end") - feature.get("start") ) * .18 ;
                    len = svgSpace.getHeight() - len;
                    console.log("bpCoord="+bpCoord+" cx="+cx+" len="+len+" scale="+this.svgScale);

                    // draw stems
                    var id = "L-"+this.fixId(fRect.f.id());

                    this.addSVGObject(id,bpCoord,100,100,function () {
                        var svgItem = document.createElementNS('http://www.w3.org/2000/svg','line');
                        svgItem.setAttribute('x1',0);
                        //svgItem.setAttribute('y1',len);
                        svgItem.setAttribute('y1',40);
                        svgItem.setAttribute('x2',0);
                        //svgItem.setAttribute('y2',svgSpace.getHeight());
                        svgItem.setAttribute('y2',50);
                        svgItem.setAttribute('stroke','rgba(255,0,0,.5)');
                        svgItem.setAttribute('stroke-width',2);
                        svgItem.setAttribute('stroke-linecap','round');
                        return svgItem;
                    });

                    // draw delicious candy
                    var id2 = "C-"+this.fixId(fRect.f.id());

                    console.log("cx="+cx+" color="+color);
                    this.addSVGObject(id2,bpCoord,100,100,function () {
                        var apple = document.createElementNS('http://www.w3.org/2000/svg','text');
                        var xlength = 3 ; // for 0 case only
                        var formattedLabel = numberWithCommas(label);
                        if(label!='0'){
                            xlength = - (formattedLabel.length-1) * 3 ;
                        }
                        apple.setAttribute('x',xlength);
                        apple.setAttribute('y','35');
                        apple.setAttribute('fill',color);
                        apple.setAttribute('display','block');
                        apple.innerHTML =  formattedLabel;
                        return apple;
                    });
                },

                renderRegion: function(context,fRect){
                    var thisB = this;
                    // create svg element new
                    var feature = fRect.f;

                    // draw line
                    var svgSpace = this.svgSpace;

                    // compute the x coord given the bpCoord
                    var bpCoord = feature.get("start");
                    var label = feature.get("label");
                    var color = feature.get("color");
                    var cx = svgSpace.bp2Native(bpCoord);
                    var start = feature.get("start");
                    var end = feature.get("end");
                    var len = (end - start ) * .18 ;
                    len = svgSpace.getHeight() - len;
                    console.log("bpCoord="+bpCoord+" cx="+cx+" len="+len+" scale="+this.svgScale);
                    console.log("rendering region "+label + " from "+ start + " to "+end) ;

                    // draw stems
                    var id = "R-"+this.fixId(fRect.f.id());

                    this.addSVGObject(id,bpCoord,100,100,function () {
                        var svgItem = document.createElementNS('http://www.w3.org/2000/svg','rect');
                        svgItem.setAttribute('width',end-start);
                        //svgItem.setAttribute('y1',len);
                        svgItem.setAttribute('height',50);
                        svgItem.setAttribute('x',0);
                        svgItem.setAttribute('y',0);
                        svgItem.setAttribute('fill',color);
                        svgItem.setAttribute('fill-opacity',0.1);
                        return svgItem;
                    });

                    var id2 = "RL-"+this.fixId(fRect.f.id());

                    console.log("cx="+cx+" color="+color);
                    this.addSVGObject(id2,bpCoord,100,100,function () {
                        var apple = document.createElementNS('http://www.w3.org/2000/svg','text');
                        var xlength = (end-start)/ 2.0 ; // for 0 case only
                        //var xLoc = svgSpace.bp2Native(xlength);
                        apple.setAttribute('x',8);
                        apple.setAttribute('y',13);
                        //apple.setAttribute('fill','white');
                        apple.setAttribute('stroke','black');
                        apple.setAttribute('display','block');
                        apple.innerHTML =  label ;
                        return apple;
                    });

                },

                renderRegionRight: function(context, fRect){
                    var thisB = this;
                    // create svg element new
                    var feature = fRect.f;

                    // draw line
                    var svgSpace = this.svgSpace;

                    // compute the x coord given the bpCoord
                    var bpCoord = feature.get("start");
                    var label = feature.get("label");
                    var color = feature.get("color");
                    var cx = svgSpace.bp2Native(bpCoord);
                    var start = feature.get("start");
                    var end = feature.get("end");
                    var len = (end - start ) * .18 ;
                    len = svgSpace.getHeight() - len;
                    console.log("bpCoord="+bpCoord+" cx="+cx+" len="+len+" scale="+this.svgScale);
                    console.log("rendering region "+label + " from "+ start + " to "+end) ;

                    var id3 = "RR-"+this.fixId(fRect.f.id());

                    console.log("cx="+cx+" color="+color);
                    this.addSVGObject(id3,bpCoord,100,100,function () {
                        var apple = document.createElementNS('http://www.w3.org/2000/svg','text');
                        var formattedLabel = numberWithCommas(label);
                        var xlength = -((formattedLabel.length-1) * 8) ;
                        apple.setAttribute('x',xlength);
                        //var xLoc = svgSpace.bp2Native(xlength);
                        //apple.setAttribute('x',-30);
                        apple.setAttribute('y',13);
                        //apple.setAttribute('fill','white');
                        apple.setAttribute('stroke','black');
                        apple.setAttribute('display','block');
                        apple.innerHTML =  label ;
                        return apple;
                    });
                },

                // draw each feature
                renderFeature: function( context, fRect ) {

                    this.inherited(arguments);      // call the superclass

                    var feature = fRect.f;
                    var type = feature.get("type");
                    if(type=='grid'){
                        this.renderGrid(context,fRect);
                    }
                    else
                    if(type=='region'){
                        console.log('render region');
                        this.renderRegion(context,fRect);
                    }
                    else
                    if(type=='region-right'){
                        console.log('render region right');
                        this.renderRegionRight(context,fRect);
                    }
                },

            });
    });