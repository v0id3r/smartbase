function TVPage(app, name) {
	var ejs_fn = app.ejs.page[name];
	if (!ejs_fn) throw 'Not defined page '+name+' template';
	app.pages[name] = this;
	
	this.app = app;
	this.el = null;
	this.buttons = {};          // хеш кнопок страницы
	this.attributes = ejs_fn.attributes; // все data атрибуты
	this.props = [
		'name',					// название
		'container_class',		// класс для контейнера
		'header_title',			// заголовок страницы, признак страницы представленной в меню
		'header_class',			// класс заголовка, признак страницы представленной в меню
		'menu_down',            // ид элемента для перехода из меню вниз
		'key_red_title',		// заголовок красной кнопки 
		'key_yellow_title',		// заголовок желтой кнопки
		'key_green_title',		// заголовок зеленой кнопки
		'key_blue_title',		// заголовок синий кнопки
		'key_return_title',		// заголовок кнопки return
		'no_footer',			// не показывать футер				
		'no_header'				// не показывать хидер
	];
	for (var i in this.props) {
		this[this.props[i]] = this.attributes[this.props[i]] || '';
	}

	this._show_args = [];       // аргументы show() страницы
}

TVPage.prototype.isMenuPage = function() {
	return this.header_title || this.header_class ? true : false;
};

TVPage.prototype.prerender = function() {
	// вызывается перед render
};

TVPage.prototype.render = function(start_btn_id) {
	// сбрасывать историю на любой странице меню или на главной странице
	if ((!TV.app.history_in_menu && this.isMenuPage()) || (TV.app.clear_history_on_index_page && this.name == this.app.index_page_name)) {
		if (this.app.history.length > 0) {
			TV.log('clearing history');
			this.app.history = [];
			// if (TV.platform.isWebOs) window.history.back(); // unavaliable because of "trustLevel":"netcast" in appinfo.json
		}
	}
	this.el = this.app.page_el;
	this.prerender();
	TV.render(this.el, this.name, this, 'page');
	this.el.className = this.container_class;
	if (this.app.header_el) {
		if (this.no_header) {
			TV.hide(this.app.header_el);
		} else {
			TV.show(this.app.header_el);
		}
	}
	if (this.app.footer_el) {
		if (this.no_header) {
			TV.hide(this.app.footer_el);
		} else {
			TV.show(this.app.footer_el);
		}
	}

	// переносим атрибут menu-down в меню хедера
	var menu_el = document.querySelector('[data-id="menu"]');
	if (menu_el) menu_el.setAttribute('data-btn-down', this.menu_down);

	TVButton.initAll(this, start_btn_id);
	if (this.onready) this.onready();

	this.app.afterPageRender && this.app.afterPageRender();
};

TVPage.prototype.show = function() {
	if (this.beforeshow) {
		if (this.beforeshow() === false) return;
	}
	var no_history = this._show_args == -1;
	this._show_args = Array.prototype.slice.call(arguments, 0);
	// если страница не из главного меню - добавляем предыдущую в историю переходов
	if ((TV.app.history_in_menu || !this.isMenuPage()) && this.app.curr_page && this.app.curr_page != this && !no_history &&
		(!this.app.history.length || this.app.history[this.app.history.length-1][0] != this.app.curr_page.name)) {
		this.app.history.push([this.app.curr_page.name, this.app.curr_page._show_args]);
		// if (TV.platform.isWebOs && window.history.state === null) { window.history.pushState({"data":"some data"}); } // unavaliable because of "trustLevel":"netcast" in appinfo.json
	}
	if (this.app.curr_page) {
		TVButton.clearAll(this.app.curr_page);
		this.app.curr_page.beforehide && this.app.curr_page.beforehide();
	}
	this.app.curr_page = this;
	this.app.renderHeader();
	this.render();
	this.app.renderFooter();
};

TVPage.prototype.hide = function() {
	if (this.app.curr_page != this) throw 'Can not hide non current page';
	if (!this.app.history.length) throw 'Empty pages history - no page to show';
	var last = this.app.history.pop();
	var page = this.app.pages[last[0]];
	page._show_args = -1; // так заставляем show не запоминать еще раз текущую страницу
	page.show.apply(page, last[1]);
};
