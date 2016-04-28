TVComponents.Menu = function(el, adjacent_buttons, parent, class_name) {
	TVComponent.call(this, el, adjacent_buttons, parent, class_name);
};
TVComponents.Menu.prototype = Object.create(TVComponent.prototype);
TVComponents.Menu.prototype.onready = function () {
    for (var btn_id in this.buttons) {
        var btn = this.buttons[btn_id];
        btn.onmouseclick = this.onButtonMouseClick.bind(this, btn);
        btn.el.onclick = btn.onmouseclick;
    }
};

TVComponents.Menu.prototype.onButtonMouseClick = function (btn, event) {
    var page_to_show = TV.app.pages[btn.attributes.page_id];
    page_to_show.show();
    if (app.curr_page.name == page_to_show.name) {
        TVButton.prototype.onmouseclick.call(btn, event);
    } else {
        btn.resetHover();
    }
};
