YUI.add("textareaAutoheight",function(a){a.TextareaAutoheight=a.Base.create("textareaAutoheight",a.Plugin.Base,[],{_originalRows:1,_rowHeight:0,_eventHandler:null,_currentRows:1,initializer:function(b){a.log("Pluging in textareaAutoheight");var e=this.get("host");this._originalRows=e.get("rows");var d=e.get("value");var c=e.getComputedStyle("paddingTop");var f=e.getComputedStyle("paddingBottom");e.setStyles({paddingTop:0,paddingBottom:0,height:"0px"}).setContent("").set("rows","1");this._rowHeight=e.get("scrollHeight");e.setStyles({paddingTop:c,paddingBottom:c,height:"auto"});e.setContent(d);this.renderUI();this.bindUI();this.syncUI(true)},destructor:function(){this.get("host").setStyle("overflow","auto").set("rows",this._originalRows);this._eventHandler.detach();this._eventHandler=null},renderUI:function(){this.get("host").setStyle("overflow","hidden")},bindUI:function(){this._eventHandler=this.get("host").on({focus:{fn:function(b){this.syncUI()},context:this},keyup:{fn:function(b){this.syncUI()},context:this},blur:{fn:function(b){this.syncUI(true)},context:this}})},syncUI:function(b){var c=this.get("host");c.set("rows","1");var d=this.get("host").get("scrollHeight")/this._rowHeight;this._currentRows=(d>=this._originalRows?d:this._originalRows);this.get("host").set("rows",(this._currentRows+(b?0:1)))}},{NS:"textareaAutoheight",ATTRS:{}})},"0.0.1",{requires:["plugin","base-build","node"]});
