exports.OK = {
    label: "OK",
    classes: ['primary'],
    action($parent,$event) {
        return $parent.close($event);
    }
};
exports.CANCEL = {
    label: "Cancel",
    classes: ['secondary'],
    action($parent,$event) {
        return $parent.close($event);
    }
};
exports.SUBMIT = function(object) {
    return {
        label: "Submit",
        classes: ['success'],
        action($parent, $event, input) {
            // api URL
            var url = "/api/v1/" + object.slug;
            console.log(input);
            console.log(url);
        }
    }
}