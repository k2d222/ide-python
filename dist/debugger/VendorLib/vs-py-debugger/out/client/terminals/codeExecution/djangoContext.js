"use strict"; // Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

var __decorate = void 0 && (void 0).__decorate || function (decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var __awaiter = void 0 && (void 0).__awaiter || function (thisArg, _arguments, P, generator) {
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : new P(function (resolve) {
        resolve(result.value);
      }).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

const inversify_1 = require("inversify");

const path = require("path");

const contextKey_1 = require("../../common/contextKey");

let DjangoContextInitializer = class DjangoContextInitializer {
  constructor(documentManager, workpaceService, fileSystem, commandManager) {
    this.documentManager = documentManager;
    this.workpaceService = workpaceService;
    this.fileSystem = fileSystem;
    this.workspaceContextKeyValues = new Map();
    this.disposables = [];
    this.isDjangoProject = new contextKey_1.ContextKey('python.isDjangoProject', commandManager);
    this.ensureContextStateIsSet().catch(ex => console.error('Python Extension: ensureState', ex));
    this.disposables.push(this.workpaceService.onDidChangeWorkspaceFolders(() => this.updateContextKeyBasedOnActiveWorkspace()));
  }

  dispose() {
    this.disposables.forEach(disposable => disposable.dispose());
  }

  updateContextKeyBasedOnActiveWorkspace() {
    if (this.monitoringActiveTextEditor) {
      return;
    }

    this.monitoringActiveTextEditor = true;
    this.disposables.push(this.documentManager.onDidChangeActiveTextEditor(() => this.ensureContextStateIsSet()));
  }

  getActiveWorkspace() {
    if (!Array.isArray(this.workpaceService.workspaceFolders) || this.workpaceService.workspaceFolders.length === 0) {
      return;
    }

    if (this.workpaceService.workspaceFolders.length === 1) {
      return this.workpaceService.workspaceFolders[0].uri.fsPath;
    }

    const activeEditor = this.documentManager.activeTextEditor;

    if (!activeEditor) {
      return;
    }

    const workspaceFolder = this.workpaceService.getWorkspaceFolder(activeEditor.document.uri);
    return workspaceFolder ? workspaceFolder.uri.fsPath : undefined;
  }

  ensureContextStateIsSet() {
    return __awaiter(this, void 0, void 0, function* () {
      const activeWorkspace = this.getActiveWorkspace();

      if (!activeWorkspace) {
        return this.isDjangoProject.set(false);
      }

      if (this.lastCheckedWorkspace === activeWorkspace) {
        return;
      }

      if (this.workspaceContextKeyValues.has(activeWorkspace)) {
        yield this.isDjangoProject.set(this.workspaceContextKeyValues.get(activeWorkspace));
      } else {
        const exists = yield this.fileSystem.fileExists(path.join(activeWorkspace, 'manage.py'));
        yield this.isDjangoProject.set(exists);
        this.workspaceContextKeyValues.set(activeWorkspace, exists);
        this.lastCheckedWorkspace = activeWorkspace;
      }
    });
  }

};
DjangoContextInitializer = __decorate([inversify_1.injectable()], DjangoContextInitializer);
exports.DjangoContextInitializer = DjangoContextInitializer;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRqYW5nb0NvbnRleHQuanMiXSwibmFtZXMiOlsiX19kZWNvcmF0ZSIsImRlY29yYXRvcnMiLCJ0YXJnZXQiLCJrZXkiLCJkZXNjIiwiYyIsImFyZ3VtZW50cyIsImxlbmd0aCIsInIiLCJPYmplY3QiLCJnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IiLCJkIiwiUmVmbGVjdCIsImRlY29yYXRlIiwiaSIsImRlZmluZVByb3BlcnR5IiwiX19hd2FpdGVyIiwidGhpc0FyZyIsIl9hcmd1bWVudHMiLCJQIiwiZ2VuZXJhdG9yIiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJmdWxmaWxsZWQiLCJ2YWx1ZSIsInN0ZXAiLCJuZXh0IiwiZSIsInJlamVjdGVkIiwicmVzdWx0IiwiZG9uZSIsInRoZW4iLCJhcHBseSIsImV4cG9ydHMiLCJpbnZlcnNpZnlfMSIsInJlcXVpcmUiLCJwYXRoIiwiY29udGV4dEtleV8xIiwiRGphbmdvQ29udGV4dEluaXRpYWxpemVyIiwiY29uc3RydWN0b3IiLCJkb2N1bWVudE1hbmFnZXIiLCJ3b3JrcGFjZVNlcnZpY2UiLCJmaWxlU3lzdGVtIiwiY29tbWFuZE1hbmFnZXIiLCJ3b3Jrc3BhY2VDb250ZXh0S2V5VmFsdWVzIiwiTWFwIiwiZGlzcG9zYWJsZXMiLCJpc0RqYW5nb1Byb2plY3QiLCJDb250ZXh0S2V5IiwiZW5zdXJlQ29udGV4dFN0YXRlSXNTZXQiLCJjYXRjaCIsImV4IiwiY29uc29sZSIsImVycm9yIiwicHVzaCIsIm9uRGlkQ2hhbmdlV29ya3NwYWNlRm9sZGVycyIsInVwZGF0ZUNvbnRleHRLZXlCYXNlZE9uQWN0aXZlV29ya3NwYWNlIiwiZGlzcG9zZSIsImZvckVhY2giLCJkaXNwb3NhYmxlIiwibW9uaXRvcmluZ0FjdGl2ZVRleHRFZGl0b3IiLCJvbkRpZENoYW5nZUFjdGl2ZVRleHRFZGl0b3IiLCJnZXRBY3RpdmVXb3Jrc3BhY2UiLCJBcnJheSIsImlzQXJyYXkiLCJ3b3Jrc3BhY2VGb2xkZXJzIiwidXJpIiwiZnNQYXRoIiwiYWN0aXZlRWRpdG9yIiwiYWN0aXZlVGV4dEVkaXRvciIsIndvcmtzcGFjZUZvbGRlciIsImdldFdvcmtzcGFjZUZvbGRlciIsImRvY3VtZW50IiwidW5kZWZpbmVkIiwiYWN0aXZlV29ya3NwYWNlIiwic2V0IiwibGFzdENoZWNrZWRXb3Jrc3BhY2UiLCJoYXMiLCJnZXQiLCJleGlzdHMiLCJmaWxlRXhpc3RzIiwiam9pbiIsImluamVjdGFibGUiXSwibWFwcGluZ3MiOiJBQUFBLGEsQ0FDQTtBQUNBOztBQUNBLElBQUlBLFVBQVUsR0FBSSxVQUFRLFNBQUtBLFVBQWQsSUFBNkIsVUFBVUMsVUFBVixFQUFzQkMsTUFBdEIsRUFBOEJDLEdBQTlCLEVBQW1DQyxJQUFuQyxFQUF5QztBQUNuRixNQUFJQyxDQUFDLEdBQUdDLFNBQVMsQ0FBQ0MsTUFBbEI7QUFBQSxNQUEwQkMsQ0FBQyxHQUFHSCxDQUFDLEdBQUcsQ0FBSixHQUFRSCxNQUFSLEdBQWlCRSxJQUFJLEtBQUssSUFBVCxHQUFnQkEsSUFBSSxHQUFHSyxNQUFNLENBQUNDLHdCQUFQLENBQWdDUixNQUFoQyxFQUF3Q0MsR0FBeEMsQ0FBdkIsR0FBc0VDLElBQXJIO0FBQUEsTUFBMkhPLENBQTNIO0FBQ0EsTUFBSSxPQUFPQyxPQUFQLEtBQW1CLFFBQW5CLElBQStCLE9BQU9BLE9BQU8sQ0FBQ0MsUUFBZixLQUE0QixVQUEvRCxFQUEyRUwsQ0FBQyxHQUFHSSxPQUFPLENBQUNDLFFBQVIsQ0FBaUJaLFVBQWpCLEVBQTZCQyxNQUE3QixFQUFxQ0MsR0FBckMsRUFBMENDLElBQTFDLENBQUosQ0FBM0UsS0FDSyxLQUFLLElBQUlVLENBQUMsR0FBR2IsVUFBVSxDQUFDTSxNQUFYLEdBQW9CLENBQWpDLEVBQW9DTyxDQUFDLElBQUksQ0FBekMsRUFBNENBLENBQUMsRUFBN0MsRUFBaUQsSUFBSUgsQ0FBQyxHQUFHVixVQUFVLENBQUNhLENBQUQsQ0FBbEIsRUFBdUJOLENBQUMsR0FBRyxDQUFDSCxDQUFDLEdBQUcsQ0FBSixH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eURBcEMsd0JBQXdCLEdBQUd2QyxVQUFVLENBQUMsQ0FDbENtQyxXQUFXLENBQUNnRCxVQUFaLEVBRGtDLENBQUQsRUFFbEM1Qyx3QkFGa0MsQ0FBckM7QUFHQUwsT0FBTyxDQUFDSyx3QkFBUixHQUFtQ0Esd0JBQW5DIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XG4vLyBDb3B5cmlnaHQgKGMpIE1pY3Jvc29mdCBDb3Jwb3JhdGlvbi4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbi8vIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZS5cbnZhciBfX2RlY29yYXRlID0gKHRoaXMgJiYgdGhpcy5fX2RlY29yYXRlKSB8fCBmdW5jdGlvbiAoZGVjb3JhdG9ycywgdGFyZ2V0LCBrZXksIGRlc2MpIHtcbiAgICB2YXIgYyA9IGFyZ3VtZW50cy5sZW5ndGgsIHIgPSBjIDwgMyA/IHRhcmdldCA6IGRlc2MgPT09IG51bGwgPyBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih0YXJnZXQsIGtleSkgOiBkZXNjLCBkO1xuICAgIGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgUmVmbGVjdC5kZWNvcmF0ZSA9PT0gXCJmdW5jdGlvblwiKSByID0gUmVmbGVjdC5kZWNvcmF0ZShkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYyk7XG4gICAgZWxzZSBmb3IgKHZhciBpID0gZGVjb3JhdG9ycy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkgaWYgKGQgPSBkZWNvcmF0b3JzW2ldKSByID0gKGMgPCAzID8gZChyKSA6IGMgPiAzID8gZCh0YXJnZXQsIGtleSwgcikgOiBkKHRhcmdldCwga2V5KSkgfHwgcjtcbiAgICByZXR1cm4gYyA+IDMgJiYgciAmJiBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBrZXksIHIpLCByO1xufTtcbnZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUocmVzdWx0LnZhbHVlKTsgfSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XG4gICAgfSk7XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY29uc3QgaW52ZXJzaWZ5XzEgPSByZXF1aXJlKFwiaW52ZXJzaWZ5XCIpO1xuY29uc3QgcGF0aCA9IHJlcXVpcmUoXCJwYXRoXCIpO1xuY29uc3QgY29udGV4dEtleV8xID0gcmVxdWlyZShcIi4uLy4uL2NvbW1vbi9jb250ZXh0S2V5XCIpO1xubGV0IERqYW5nb0NvbnRleHRJbml0aWFsaXplciA9IGNsYXNzIERqYW5nb0NvbnRleHRJbml0aWFsaXplciB7XG4gICAgY29uc3RydWN0b3IoZG9jdW1lbnRNYW5hZ2VyLCB3b3JrcGFjZVNlcnZpY2UsIGZpbGVTeXN0ZW0sIGNvbW1hbmRNYW5hZ2VyKSB7XG4gICAgICAgIHRoaXMuZG9jdW1lbnRNYW5hZ2VyID0gZG9jdW1lbnRNYW5hZ2VyO1xuICAgICAgICB0aGlzLndvcmtwYWNlU2VydmljZSA9IHdvcmtwYWNlU2VydmljZTtcbiAgICAgICAgdGhpcy5maWxlU3lzdGVtID0gZmlsZVN5c3RlbTtcbiAgICAgICAgdGhpcy53b3Jrc3BhY2VDb250ZXh0S2V5VmFsdWVzID0gbmV3IE1hcCgpO1xuICAgICAgICB0aGlzLmRpc3Bvc2FibGVzID0gW107XG4gICAgICAgIHRoaXMuaXNEamFuZ29Qcm9qZWN0ID0gbmV3IGNvbnRleHRLZXlfMS5Db250ZXh0S2V5KCdweXRob24uaXNEamFuZ29Qcm9qZWN0JywgY29tbWFuZE1hbmFnZXIpO1xuICAgICAgICB0aGlzLmVuc3VyZUNvbnRleHRTdGF0ZUlzU2V0KClcbiAgICAgICAgICAgIC5jYXRjaChleCA9PiBjb25zb2xlLmVycm9yKCdQeXRob24gRXh0ZW5zaW9uOiBlbnN1cmVTdGF0ZScsIGV4KSk7XG4gICAgICAgIHRoaXMuZGlzcG9zYWJsZXMucHVzaCh0aGlzLndvcmtwYWNlU2VydmljZS5vbkRpZENoYW5nZVdvcmtzcGFjZUZvbGRlcnMoKCkgPT4gdGhpcy51cGRhdGVDb250ZXh0S2V5QmFzZWRPbkFjdGl2ZVdvcmtzcGFjZSgpKSk7XG4gICAgfVxuICAgIGRpc3Bvc2UoKSB7XG4gICAgICAgIHRoaXMuZGlzcG9zYWJsZXMuZm9yRWFjaChkaXNwb3NhYmxlID0+IGRpc3Bvc2FibGUuZGlzcG9zZSgpKTtcbiAgICB9XG4gICAgdXBkYXRlQ29udGV4dEtleUJhc2VkT25BY3RpdmVXb3Jrc3BhY2UoKSB7XG4gICAgICAgIGlmICh0aGlzLm1vbml0b3JpbmdBY3RpdmVUZXh0RWRpdG9yKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5tb25pdG9yaW5nQWN0aXZlVGV4dEVkaXRvciA9IHRydWU7XG4gICAgICAgIHRoaXMuZGlzcG9zYWJsZXMucHVzaCh0aGlzLmRvY3VtZW50TWFuYWdlci5vbkRpZENoYW5nZUFjdGl2ZVRleHRFZGl0b3IoKCkgPT4gdGhpcy5lbnN1cmVDb250ZXh0U3RhdGVJc1NldCgpKSk7XG4gICAgfVxuICAgIGdldEFjdGl2ZVdvcmtzcGFjZSgpIHtcbiAgICAgICAgaWYgKCFBcnJheS5pc0FycmF5KHRoaXMud29ya3BhY2VTZXJ2aWNlLndvcmtzcGFjZUZvbGRlcnMpIHx8IHRoaXMud29ya3BhY2VTZXJ2aWNlLndvcmtzcGFjZUZvbGRlcnMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMud29ya3BhY2VTZXJ2aWNlLndvcmtzcGFjZUZvbGRlcnMubGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy53b3JrcGFjZVNlcnZpY2Uud29ya3NwYWNlRm9sZGVyc1swXS51cmkuZnNQYXRoO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGFjdGl2ZUVkaXRvciA9IHRoaXMuZG9jdW1lbnRNYW5hZ2VyLmFjdGl2ZVRleHRFZGl0b3I7XG4gICAgICAgIGlmICghYWN0aXZlRWRpdG9yKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY29uc3Qgd29ya3NwYWNlRm9sZGVyID0gdGhpcy53b3JrcGFjZVNlcnZpY2UuZ2V0V29ya3NwYWNlRm9sZGVyKGFjdGl2ZUVkaXRvci5kb2N1bWVudC51cmkpO1xuICAgICAgICByZXR1cm4gd29ya3NwYWNlRm9sZGVyID8gd29ya3NwYWNlRm9sZGVyLnVyaS5mc1BhdGggOiB1bmRlZmluZWQ7XG4gICAgfVxuICAgIGVuc3VyZUNvbnRleHRTdGF0ZUlzU2V0KCkge1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICAgICAgY29uc3QgYWN0aXZlV29ya3NwYWNlID0gdGhpcy5nZXRBY3RpdmVXb3Jrc3BhY2UoKTtcbiAgICAgICAgICAgIGlmICghYWN0aXZlV29ya3NwYWNlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuaXNEamFuZ29Qcm9qZWN0LnNldChmYWxzZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGhpcy5sYXN0Q2hlY2tlZFdvcmtzcGFjZSA9PT0gYWN0aXZlV29ya3NwYWNlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRoaXMud29ya3NwYWNlQ29udGV4dEtleVZhbHVlcy5oYXMoYWN0aXZlV29ya3NwYWNlKSkge1xuICAgICAgICAgICAgICAgIHlpZWxkIHRoaXMuaXNEamFuZ29Qcm9qZWN0LnNldCh0aGlzLndvcmtzcGFjZUNvbnRleHRLZXlWYWx1ZXMuZ2V0KGFjdGl2ZVdvcmtzcGFjZSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZXhpc3RzID0geWllbGQgdGhpcy5maWxlU3lzdGVtLmZpbGVFeGlzdHMocGF0aC5qb2luKGFjdGl2ZVdvcmtzcGFjZSwgJ21hbmFnZS5weScpKTtcbiAgICAgICAgICAgICAgICB5aWVsZCB0aGlzLmlzRGphbmdvUHJvamVjdC5zZXQoZXhpc3RzKTtcbiAgICAgICAgICAgICAgICB0aGlzLndvcmtzcGFjZUNvbnRleHRLZXlWYWx1ZXMuc2V0KGFjdGl2ZVdvcmtzcGFjZSwgZXhpc3RzKTtcbiAgICAgICAgICAgICAgICB0aGlzLmxhc3RDaGVja2VkV29ya3NwYWNlID0gYWN0aXZlV29ya3NwYWNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG59O1xuRGphbmdvQ29udGV4dEluaXRpYWxpemVyID0gX19kZWNvcmF0ZShbXG4gICAgaW52ZXJzaWZ5XzEuaW5qZWN0YWJsZSgpXG5dLCBEamFuZ29Db250ZXh0SW5pdGlhbGl6ZXIpO1xuZXhwb3J0cy5EamFuZ29Db250ZXh0SW5pdGlhbGl6ZXIgPSBEamFuZ29Db250ZXh0SW5pdGlhbGl6ZXI7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kamFuZ29Db250ZXh0LmpzLm1hcCJdfQ==