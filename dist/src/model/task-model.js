"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toTaskResponse = toTaskResponse;
function toTaskResponse(task) {
    return {
        id: task.id,
        title: task.title,
        desc: task.desc,
        completed: task.completed,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt,
    };
}
