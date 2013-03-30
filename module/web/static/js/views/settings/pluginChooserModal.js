define(['jquery', 'underscore', 'app', 'views/abstract/modalView', 'text!tpl/default/pluginChooserDialog.html', 'select2'],
    function($, _, App, modalView, template) {
        return modalView.extend({

            events: {
                'click .btn-add': 'add'
            },
            template: _.compile(template),
            plugins: null,
            select: null,

            initialize: function() {
                // Inherit parent events
                this.events = _.extend({}, modalView.prototype.events, this.events);
                var self = this;
                $.ajax(App.apiRequest('getAvailablePlugins', null, {success: function(data) {
                    self.plugins = data;
                    self.render();
                }
                }));
            },

            onRender: function() {
                // TODO: could be a seperate input type if needed on multiple pages
                if (this.plugins)
                    this.select = this.$('#pluginSelect').select2({
                        escapeMarkup: function(m) {
                            return m;
                        },
                        formatResult: this.format,
                        formatSelection: this.formatSelection,
                        data: {results: this.plugins, text: function(item) {
                            return item.label;
                        }},
                        id: function(item) {
                            return item.name;
                        }
                    });
            },

            onShow: function() {
            },

            onHide: function() {
            },

            format: function(data) {
                var s = '<div class="plugin-select" style="background-image: url(icons/' + data.name + '">' + data.label;
                s += "<br><span>" + data.description + "<span></div>";
                return s;
            },

            formatSelection: function(data) {
                return '<img class="logo-select" src="icons/' + data.name + '"> ' + data.label;
            },

            add: function(e) {
                e.stopPropagation();
                if (this.select) {
                    var plugin = this.select.val();
                    App.settingsView.openConfig(plugin);
                    this.hide();
                }
            }
        });
    });