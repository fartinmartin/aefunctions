{

    "attachKeys": function(inKeys, outKeys) {

        if (inKeys >= 1 && outKeys >= 1) { // There is in and out animation
    
            var outStart = thisLayer.outPoint - (key(numKeys).time - key(numKeys - outKeys).time);
            var inFinish = thisLayer.inPoint + (key(inKeys).time - key(1).time);
            var t = 0;
    
            if (time < inPoint) {
                return valueAtTime(key(1).time);
            } else if (time < inFinish) {
                return valueAtTime(key(1).time + (time - inPoint));
            } else if (time < outStart) {
                return valueAtTime(key(inKeys).time);
            } else {
                t = time - outStart;
                return valueAtTime(key(numKeys - outKeys).time + t);
            }
        } else if (inKeys == 0 && outKeys >= 2) { // Animation out only
    
            outStart = thisLayer.outPoint - (key(outKeys).time - key(1).time);
    
            if (time < outStart) {
                return valueAtTime(key(1).time);
            } else {
                t = time - outStart;
                return valueAtTime(key(1).time + t);
            }
        } else if (inKeys >= 2 && outKeys == 0) { // Animation in only
    
            inFinish = thisLayer.inPoint + (key(inKeys).time - key(1).time);
    
            if (time < thisLayer.inPoint) {
                return valueAtTime(key(1).time);
            } else if (time < inFinish) {
                return valueAtTime(key(1).time + (time - inPoint));
            } else {
                return valueAtTime(key(inKeys).time);
            }
        } else { // Default option if no range specified
            return value;
        }
    },

    "bounceKeys": function(amp, freq, decay, keyMin, keyMax) {

        var curKey = 0;
        var t;
        
        // Set curKey to the previous keyframe
        if (numKeys > 0){
            curKey = nearestKey(time).index;
            if (key(curKey).time > time){
                curKey--;
            }
        }
    
        // Set t to the time to curKey
        if (curKey == 0){
            t = 0;
        } else {
            t = time - key(curKey).time;
        }
    
        if (curKey > 0 && curKey >= keyMin && curKey <= keyMax && t < 3){
            v = velocityAtTime(key(curKey).time - thisComp.frameDuration/10);
            return value + v*amp*Math.sin(freq*t*2*Math.PI)/Math.exp(decay*t);
        } else {
            return value;
        }
    },

    "hideLayerWhenBelow": function(layerIndex) {
        var aboveLayer;
        try {
            aboveLayer = thisComp.layer(layerIndex);
            if(time < aboveLayer.inPoint) {
                // Before above layer starts
                return 100;
            } else {
                // After above layer starts
                return 0;
            }
        } catch(err) {
            // Layer is first layer
            return 100;
        }
    },

    "isometricPosition": function(pointControl, offset) {
	
        var xGrid = effect(pointControl)("Point")[0];
        var yGrid = effect(pointControl)("Point")[1];
    
        var x = (xGrid*1.75 - yGrid) ;
        var y = (xGrid + yGrid/1.75)
    
        return offset + [x,y]
    },

    "layerBoundsPath": function(sourceLayer, extend, sampleTime) {

        // Function input defaults
        sourceLayer = (typeof sourceLayer !== 'undefined') ?  sourceLayer : thisLayer;
        extend = (typeof extend !== 'undefined') ?  extend : false;
        sampleTime = (typeof sampleTime !== 'undefined') ?  sampleTime : time-inPoint;
    
        var layerWidth = sourceLayer.sourceRectAtTime(sampleTime, extend).width;
        var layerHeight = sourceLayer.sourceRectAtTime(sampleTime, extend).height;
        var layerTop = sourceLayer.sourceRectAtTime(sampleTime, extend).top;
        var layerLeft = sourceLayer.sourceRectAtTime(sampleTime, extend).left;
    
        var maskPoints = [
            [layerLeft, layerTop],
            [layerLeft + layerWidth, layerTop],
            [layerLeft + layerWidth, layerTop + layerHeight],
            [layerLeft, layerTop + layerHeight]
        ];
    
        return createPath(points = maskPoints, inTangents = [], outTangents = [], is_closed = true);
    },

    "layerSize": function(layerIndex, sampleTime) {
        
        sampleTime = (typeof sampleTime !== 'undefined') ?  sampleTime : time;
        var layerSize = [
            thisComp.layer(layerIndex).sourceRectAtTime(time, true).width,
            thisComp.layer(layerIndex).sourceRectAtTime(time, true).height
            
        ];
        return(layerSize);
    },

    "effectsSearch": function(effectName) {

        totalEffects = thisLayer("Effects").numProperties;
        selectEffects = 0;
    
        if (effectName != null) {
    
            for (i = 1; i <= totalEffects; i++) {
              if (thisLayer("Effects")(i).name.toLowerCase().indexOf(effectName) > -1){
                selectEffects++;
              }
            }
            return selectEffects;
            
        } else {
            return totalEffects;
        }
    },

    "textCount": function(sourceText, type) {

        type = (typeof type !== 'undefined') ?  type : "word";
        var count;
    
        switch (type) {
    
            case "word":
                count = sourceText.split(" ").length;
                break;
            case "line":
                count  = sourceText.split(/[^\r\n]+/g).length;
                break;
            case "char":
                count = sourceText.length;
                break;
            default:
                count = null;
                break;
        }
    
        return count;
    },

}