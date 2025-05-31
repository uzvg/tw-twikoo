/*\
title: $:/plugins/yourusername/twikoo/twikoo.js
type: application/javascript
module-type: widget

Twikoo comment system widget for TiddlyWiki

\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

var Widget = require("$:/core/modules/widgets/widget.js").widget;

var TwikooWidget = function(parseTreeNode,options) {
    this.initialise(parseTreeNode,options);
};

TwikooWidget.prototype = new Widget();

TwikooWidget.prototype.render = function(parent,nextSibling) {
    this.parentDomNode = parent;
    this.computeAttributes();
    this.execute();

    // Create the comment container
    var commentId = this.getAttribute("tcommentId", "tcomment");
    var containerElement = document.createElement("div");
    containerElement.id = commentId;
    
    // Insert the element into the DOM
    parent.insertBefore(containerElement, nextSibling);
    this.domNodes.push(containerElement);

    // Initialize Twikoo with the provided parameters
    var envId = this.getAttribute("envId", "");
    var region = this.getAttribute("region", "ap-shanghai");
    var path = this.getAttribute("path", this.getDefaultPath());
    var lang = this.getAttribute("lang", "zh-CN");

    // Wait for the script to be loaded before initializing
    if (typeof twikoo !== "undefined") {
        this.initializeTwikoo(commentId, envId, region, path, lang);
    } else {
        // If twikoo is not loaded yet, wait for it
        var self = this;
        var checkTwikooInterval = setInterval(function() {
            if (typeof twikoo !== "undefined") {
                clearInterval(checkTwikooInterval);
                self.initializeTwikoo(commentId, envId, region, path, lang);
            }
        }, 100);
    }
};

TwikooWidget.prototype.getDefaultPath = function() {
    // Try to get the current tiddler title as the default path
    var currentTiddler = this.getVariable("currentTiddler");
    return currentTiddler || location.pathname;
};

TwikooWidget.prototype.initializeTwikoo = function(commentId, envId, region, path, lang) {
    twikoo.init({
        envId: envId,
        el: '#' + commentId,
        region: region,
        path: path,
        lang: lang
    });
};

TwikooWidget.prototype.execute = function() {
    // Get access to variables
    this.currentTiddler = this.getVariable("currentTiddler");
};

TwikooWidget.prototype.refresh = function(changedTiddlers) {
    // Re-render if our attributes have changed
    var changedAttributes = this.computeAttributes();
    if(changedAttributes.tcommentId || changedAttributes.envId || 
       changedAttributes.region || changedAttributes.path || 
       changedAttributes.lang) {
        this.refreshSelf();
        return true;
    }
    return false;
};

exports.twikoo = TwikooWidget;

})();