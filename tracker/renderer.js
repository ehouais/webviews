define(['ui-utils', 'text!templates.html'], function($, html) {
    document.body.innerHTML = html;
    var templates = $.extract('template-id');

    var template = function(dom, impl) {
            return function(data) {
                if (data) {
                    var node = document.contains(dom) ? dom : dom.cloneNode(true);

                    impl.call(node, data);

                    return node;
                }
            };
        };

    var todoTpl = template(templates['todo'], function(todo) {
            this.classList.add('list-group-item-'+{high: 'danger', low: 'warning', done: 'success'}[todo.status]);
            $.select('.description', this).textContent = todo.description;
            $.select('.id', this).textContent = todo.id;
            $.select('.sprint', this).textContent = todo.sprint;
        }),
        todosTpl = template(templates['todos'], function(todos) {
            $.toNodes(this, todoTpl)(todos);
        });

    return {
        update: function(components) {
            document.body.innerHTML = '';

            $.toNodes(document.body, template(templates['component'], function(component) {
                $.select('h2', this).textContent = component.name;

                // Sort todos
                var todos = component.todos.reduce(function(todos, todo) {
                    if (todo.status == 'done') {
                        var sprint = todo.sprint || '?';
                        (todos.dones[sprint] = todos.dones[sprint] || []).push(todo);
                    } else {
                        todos.todos.push(todo);
                    }
                    return todos;
                }, {todos: [], dones: {}});

                // Things to do
                $.toNode($.select('.notdones', this), todosTpl)(todos.todos);

                // Things already done
                var $dones = $.select('.dones', this);
                Object.keys(todos.dones).forEach(function(sprint) {
                    $dones.appendChild(todosTpl(todos.dones[sprint]));
                });
            }))(components);
        }
    };
});
