TVComponents.Menu = function(el, adjacent_buttons, parent, class_name) {
	TVComponent.call(this, el, adjacent_buttons, parent, class_name);
};
TVComponents.Menu.prototype = Object.create(TVComponent.prototype);

TVComponents.Menu.prototype.onButtonClick = function (btn,event) {
    var page_to_show = TV.app.pages[btn.attributes.page_id];
    page_to_show.show();
    TVComponent.prototype.onButtonClick.call(this,btn,event);

    if (app.curr_page.name !== page_to_show.name) {
        btn.resetHover();
        this.buttons._hover_btn = null;
        btn.resetAct();
        for(var btn_id in this.buttons) {
            var curr_btn = this.buttons[btn_id];
            if(curr_btn.attributes.page_id == app.curr_page.name) {
                this.buttons._start_btn = curr_btn.adjacent_buttons._act_btn = curr_btn;
                TV.addClass(curr_btn.el, TVButton.act_class);
                break;
            }
        }
    }
};
