define(['jsontree'], function(JSONTree, loadCss) {
    return {
        update: function(obj) {
            document.body.innerHTML = JSONTree.create(obj);
        }
    };
});
