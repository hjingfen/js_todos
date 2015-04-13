window.onload = function () {
    task.listen_enter();
    localStorage.setItem('tasks', localStorage.getItem('tasks') || '[]');
    task.init();
};

var task = function() {

    function create() {
        var tasks = JSON.parse(localStorage.getItem('tasks'));
        var id = tasks.length == 0 ? 0 : _.max(_.pluck(tasks, 'id')) + 1;
        var new_template = document.getElementById('template').cloneNode(true);
        new_template.classList.remove('hide');
        new_template.id = id;
        new_template.getElementsByClassName('item')[0].innerHTML = getInputValue();
        document.getElementById('todo_lists').appendChild(new_template);
        tasks.unshift({id: id, name: getInputValue(), finished: false});
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function show() {
        var tasks = JSON.parse(localStorage.getItem('tasks'));
        _.each(tasks, function(task) {
            var new_template = document.getElementById('template').cloneNode(true);
            new_template.classList.remove('hide');
            new_template.id = task.id;
            if(task.finished)  new_template.classList.add('finished');
            new_template.getElementsByClassName('item')[0].innerHTML = task.name;
            document.getElementById('todo_lists').appendChild(new_template);
        });
    }

    function leftCount() {
        var tasks = JSON.parse(localStorage.getItem('tasks'));
        var leftTaskCount = _.filter(tasks, function(task) {
            return !task.finished;
        }).length;
        document.getElementById('leftCount').innerHTML = leftTaskCount;
    }

    function showOrHideFooter() {
        var footer = document.getElementById('footer');
        var tasks = JSON.parse(localStorage.getItem('tasks'));
        tasks.length == 0 ? footer.classList.add('hide') : footer.classList.remove('hide');
    }

    function allFinished() {
        var tasks = JSON.parse(localStorage.getItem('tasks'));
        var allFinishedClassList = document.getElementById('allFinished').classList;
        var arrowClassList = document.getElementById('arrow').classList;
        if(isAllFinished(tasks)){
            allFinishedClassList.remove('hide');
            arrowClassList.add('yellowgreen');
        }else{
            allFinishedClassList.add('hide');
            arrowClassList.remove('yellowgreen');
        }
    }

    function getInputValue() {
        return document.getElementById('todo_input').value;
    }

    function clearInput() {
        document.getElementById('todo_input').value = '';
    }

    function hasFinished(classLists) {
        return !!_.find(classLists, function (item) {
            return item == 'finished';
        });
    }

    function isAllFinished(tasks) {
        var finishedState = _.pluck(tasks, 'finished');
        return tasks.length != 0 && _.every(finishedState, function (state) {
            return state == true;
        });
    }

    function clearFinished() {
        var tasks = JSON.parse(localStorage.getItem('tasks'));
        _.each(tasks, function (task) {
            if (task.finished) {
                var list = document.getElementById(task.id);
                document.getElementById('todo_lists').removeChild(list);
            }
        });
        var unfinishedTasks = _.filter(tasks, function (task) {
            return !task.finished;
        });
        localStorage.setItem('tasks', JSON.stringify(unfinishedTasks));
    }

    function completeCount() {
        var tasks = JSON.parse(localStorage.getItem('tasks'));
        return _.filter(tasks, function (task) {
            return task.finished;
        }).length;
    }

    return {
        init: function () {
            show();
            leftCount();
            showOrHideFooter();
            allFinished();
            document.getElementById('completeCount').innerHTML = completeCount();
        },

        listen_enter: function() {
            document.getElementById('todo_input').onkeyup = function (e) {
                if (e.which == 13) {
                    create();
                    leftCount();
                    showOrHideFooter();
                    allFinished();
                    clearInput();
                }
            };
        },

        finish: function (el) {
            var classLists = el.parentNode.classList;
            var tasks = JSON.parse(localStorage.getItem('tasks'));
            _.each(tasks, function (task) {
                if(task.id == el.parentNode.id) task.finished = !hasFinished(classLists);
            });
            hasFinished(classLists) ? classLists.remove('finished') : classLists.add('finished');
            localStorage.setItem('tasks', JSON.stringify(tasks));
            allFinished();
            leftCount();
            document.getElementById('completeCount').innerHTML = completeCount();
        },

        delete: function(el) {
            var list = el.parentNode;
            var tasks = JSON.parse(localStorage.getItem('tasks'));
            var newTasks = _.reject(tasks, function (task) {
                return task.id == list.id;
            });
            document.getElementById('leftCount').innerHTML = newTasks.length;
            localStorage.setItem('tasks', JSON.stringify(newTasks));
            document.getElementById('todo_lists').removeChild(list);
            showOrHideFooter();
            document.getElementById('completeCount').innerHTML = completeCount();
        },

        clear: function() {
            clearFinished();
            showOrHideFooter();
            allFinished();
            document.getElementById('completeCount').innerHTML = completeCount();
        }
    }
}();