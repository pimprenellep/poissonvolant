class Action {
    objsBefore(objs) {
        this.objsBefore = new Set(objs);
    }

    objsAfter(objs) {
        const difference = (a, b) => new Set([...a].filter(x => !b.has(x)));
        this.objsAfter = new Set(objs);
        this.objsToDelete = difference(this.objsAfter, this.objsBefore);
    }

    undo() {
        for(let obj of this.objsToDelete) 
            obj.parent.remove(obj);
    }
}