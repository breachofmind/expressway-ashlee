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
exports.SUBMIT = {
    label: "Submit",
    classes: ['success'],
    action($parent,$event) {
        return $parent.submit($event);
    }
};

