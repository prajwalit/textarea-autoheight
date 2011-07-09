/**
 * A YUI3 plugin which adds auto-height functionality to textareas.
 * @author Prajwalit Bhopale <contact@prajwalit.com>
 * @created Jul 9, 2011
 * @module textareaAutoheight
 * @requires node
 *
 * Copyright (c) 2011, Prajwalit Bhopale
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 * - Redistributions of source code must retain the above copyright
 * notice, this list of conditions and the following disclaimer.
 * - Redistributions in binary form must reproduce the above copyright
 * notice, this list of conditions and the following disclaimer in the
 * documentation and/or other materials provided with the distribution.
 * - Neither the name of the author nor the
 * names of its contributors may be used to endorse or promote products
 * derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 */


/**
 * This method (just) registers the module so that it can attached to a YUI instance
 * via the use method. It's executed at YUI().use(...) phase.
 */
YUI.add("textareaAutoheight", function(Y) {

  /**
   * @class Y.TextareaAutoheight
   * @example -
   * new Y.TextareaAutoheight ({
   *   node: Y.one("textarea")
   * }).render ();
   */
  Y.TextareaAutoheight = Y.Base.create ("textareaAutoheight", Y.Plugin.Base, [], {

    /**
     * Stores original "rows" attribute to go back to original state.
     */
    _originalRows: 1,
    
    /**
     * Stores height of single row used to get total number of rows.
     */
    _rowHeight: 0,
    
    /**
     * textarea events handler. focus/keyup/blur
     */
    _eventHandler: null,
    
    /**
     * Stores current value of "rows" attribute.
     */
    _currentRows: 1,
    
    /**
     * Constructor for TextareaAutoheight.
     */
    initializer: function (config) {
      Y.log ("Pluging in textareaAutoheight");
      
      var node = this.get ("host");
      this._originalRows = node.get ("rows");

      // We need to calculate row height of textarea.
      // for that we're going to strip all css properties that affect height,
      // calculate rowHeight, and then put all those styles back again.
      var content = node.get ("value");
      var paddingTop = node.getComputedStyle ("paddingTop");
      var paddingBottom = node.getComputedStyle ("paddingBottom");
      node.setStyles ({
        paddingTop: 0,
        paddingBottom: 0,
        height: "0px"
      }).setContent ("")
        .set ("rows", "1");
      this._rowHeight = node.get ("scrollHeight");
      node.setStyles ({
        paddingTop: paddingTop,
        paddingBottom: paddingTop,
        height: "auto"
      });
      node.setContent (content);

      // Renderer
      this.renderUI ();      
      this.bindUI ();
      this.syncUI (true);
    },
    
    /**
     * Destructor for TextareaAutoheight.
     */
    destructor: function () {
      this.get ("host").setStyle ("overflow", "auto").set ("rows", this._originalRows);
      this._eventHandler.detach ();
      this._eventHandler = null;
    },

    /**
     * RenderUI function for namespace.
     * This method is responsible for creating and adding the nodes which
     * the widget needs into the document.
     */
    renderUI: function () {
      this.get ("host").setStyle ("overflow", "hidden");
    },    

    /**
     * BindUI function for TextareaAutoheight.
     * This method is responsible for attaching event listeners which bind the UI
     * to the widget state. 
     */
    bindUI: function () {
      this._eventHandler = this.get ("host").on ({
        "focus": {
          fn: function (event) {
            this.syncUI ();
          },
          context: this
        },
        "keyup": {
          fn: function (event) {
            this.syncUI ();
          },
          context: this
        },
        "blur": {
          fn: function (event) {
            this.syncUI (true);
          },
          context: this
        }
      });
    },

    /**
     * SyncUI function for TextareaAutoheight.
     * This method is responsible for setting the initial state of the UI based on
     * the current state of the widget at the time of rendering.
     *
     * To avoid jumpiness, this widget adds one extra row when user is typing.
     * When perfectHeight is true, that extra row will not get added.
     */
    syncUI: function (perfectHeight) {
      var node = this.get ("host");
      node.set ("rows", "1");
      var rows = this.get ("host").get ("scrollHeight")/this._rowHeight;
      this._currentRows = (rows >= this._originalRows ? rows : this._originalRows);
      this.get ("host").set ("rows", (this._currentRows + (perfectHeight?0:1)));
    }
    
  }, {

    /**
     * Plugin NameSpace.
     */    
    NS: "textareaAutoheight",
    /**
     * Config attributes for TextareaAutoheight go here.
     */
    ATTRS: {}
  });

}, "0.0.1", {requires:["plugin", "base-build", "node"]});
