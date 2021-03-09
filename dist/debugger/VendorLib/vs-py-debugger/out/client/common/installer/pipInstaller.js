"use strict"; // Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

var __decorate = void 0 && (void 0).__decorate || function (decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var __param = void 0 && (void 0).__param || function (paramIndex, decorator) {
  return function (target, key) {
    decorator(target, key, paramIndex);
  };
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

const types_1 = require("../../ioc/types");

const types_2 = require("../application/types");

const types_3 = require("../process/types");

const moduleInstaller_1 = require("./moduleInstaller");

let PipInstaller = class PipInstaller extends moduleInstaller_1.ModuleInstaller {
  constructor(serviceContainer) {
    super(serviceContainer);
  }

  get displayName() {
    return 'Pip';
  }

  get priority() {
    return 0;
  }

  isSupported(resource) {
    return this.isPipAvailable(resource);
  }

  getExecutionInfo(moduleName, resource) {
    return __awaiter(this, void 0, void 0, function* () {
      const proxyArgs = [];
      const workspaceService = this.serviceContainer.get(types_2.IWorkspaceService);
      const proxy = workspaceService.getConfiguration('http').get('proxy', '');

      if (proxy.length > 0) {
        proxyArgs.push('--proxy');
        proxyArgs.push(proxy);
      }

      return {
        args: [...proxyArgs, 'install', '-U', moduleName],
        moduleName: 'pip'
      };
    });
  }

  isPipAvailable(resource) {
    const pythonExecutionFactory = this.serviceContainer.get(types_3.IPythonExecutionFactory);
    return pythonExecutionFactory.create({
      resource
    }).then(proc => proc.isModuleInstalled('pip')).catch(() => false);
  }

};
PipInstaller = __decorate([inversify_1.injectable(), __param(0, inversify_1.inject(types_1.IServiceContainer))], PipInstaller);
exports.PipInstaller = PipInstaller;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBpcEluc3RhbGxlci5qcyJdLCJuYW1lcyI6WyJfX2RlY29yYXRlIiwiZGVjb3JhdG9ycyIsInRhcmdldCIsImtleSIsImRlc2MiLCJjIiwiYXJndW1lbnRzIiwibGVuZ3RoIiwiciIsIk9iamVjdCIsImdldE93blByb3BlcnR5RGVzY3JpcHRvciIsImQiLCJSZWZsZWN0IiwiZGVjb3JhdGUiLCJpIiwiZGVmaW5lUHJvcGVydHkiLCJfX3BhcmFtIiwicGFyYW1JbmRleCIsImRlY29yYXRvciIsIl9fYXdhaXRlciIsInRoaXNBcmciLCJfYXJndW1lbnRzIiwiUCIsImdlbmVyYXRvciIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0IiwiZnVsZmlsbGVkIiwidmFsdWUiLCJzdGVwIiwibmV4dCIsImUiLCJyZWplY3RlZCIsInJlc3VsdCIsImRvbmUiLCJ0aGVuIiwiYXBwbHkiLCJleHBvcnRzIiwiaW52ZXJzaWZ5XzEiLCJyZXF1aXJlIiwidHlwZXNfMSIsInR5cGVzXzIiLCJ0eXBlc18zIiwibW9kdWxlSW5zdGFsbGVyXzEiLCJQaXBJbnN0YWxsZXIiLCJNb2R1bGVJbnN0YWxsZXIiLCJjb25zdHJ1Y3RvciIsInNlcnZpY2VDb250YWluZXIiLCJkaXNwbGF5TmFtZSIsInByaW9yaXR5IiwiaXNTdXBwb3J0ZWQiLCJyZXNvdXJjZSIsImlzUGlwQXZhaWxhYmxlIiwiZ2V0RXhlY3V0aW9uSW5mbyIsIm1vZHVsZU5hbWUiLCJwcm94eUFyZ3MiLCJ3b3Jrc3BhY2VTZXJ2aWNlIiwiZ2V0IiwiSVdvcmtzcGFjZVNlcnZpY2UiLCJwcm94eSIsImdldENvbmZpZ3VyYXRpb24iLCJwdXNoIiwiYXJncyIsInB5dGhvbkV4ZWN1dGlvbkZhY3RvcnkiLCJJUHl0aG9uRXhlY3V0aW9uRmFjdG9yeSIsImNyZWF0ZSIsInByb2MiLCJpc01vZHVsZUluc3RhbGxlZCIsImNhdGNoIiwiaW5qZWN0YWJsZSIsImluamVjdCIsIklTZXJ2aWNlQ29udGFpbmVyIl0sIm1hcHBpbmdz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WSxHQUFHNUMsVUFBVSxDQUFDLENBQ3RCc0MsV0FBVyxDQUFDK0IsVUFBWixFQURzQixFQUV0QnJELE9BQU8sQ0FBQyxDQUFELEVBQUlzQixXQUFXLENBQUNnQyxNQUFaLENBQW1COUIsT0FBTyxDQUFDK0IsaUJBQTNCLENBQUosQ0FGZSxDQUFELEVBR3RCM0IsWUFIc0IsQ0FBekI7QUFJQVAsT0FBTyxDQUFDTyxZQUFSLEdBQXVCQSxZQUF2QiIsInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO1xuLy8gQ29weXJpZ2h0IChjKSBNaWNyb3NvZnQgQ29ycG9yYXRpb24uIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4vLyBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuXG52YXIgX19kZWNvcmF0ZSA9ICh0aGlzICYmIHRoaXMuX19kZWNvcmF0ZSkgfHwgZnVuY3Rpb24gKGRlY29yYXRvcnMsIHRhcmdldCwga2V5LCBkZXNjKSB7XG4gICAgdmFyIGMgPSBhcmd1bWVudHMubGVuZ3RoLCByID0gYyA8IDMgPyB0YXJnZXQgOiBkZXNjID09PSBudWxsID8gZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBrZXkpIDogZGVzYywgZDtcbiAgICBpZiAodHlwZW9mIFJlZmxlY3QgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIFJlZmxlY3QuZGVjb3JhdGUgPT09IFwiZnVuY3Rpb25cIikgciA9IFJlZmxlY3QuZGVjb3JhdGUoZGVjb3JhdG9ycywgdGFyZ2V0LCBrZXksIGRlc2MpO1xuICAgIGVsc2UgZm9yICh2YXIgaSA9IGRlY29yYXRvcnMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIGlmIChkID0gZGVjb3JhdG9yc1tpXSkgciA9IChjIDwgMyA/IGQocikgOiBjID4gMyA/IGQodGFyZ2V0LCBrZXksIHIpIDogZCh0YXJnZXQsIGtleSkpIHx8IHI7XG4gICAgcmV0dXJuIGMgPiAzICYmIHIgJiYgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwga2V5LCByKSwgcjtcbn07XG52YXIgX19wYXJhbSA9ICh0aGlzICYmIHRoaXMuX19wYXJhbSkgfHwgZnVuY3Rpb24gKHBhcmFtSW5kZXgsIGRlY29yYXRvcikge1xuICAgIHJldHVybiBmdW5jdGlvbiAodGFyZ2V0LCBrZXkpIHsgZGVjb3JhdG9yKHRhcmdldCwga2V5LCBwYXJhbUluZGV4KTsgfVxufTtcbnZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUocmVzdWx0LnZhbHVlKTsgfSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XG4gICAgfSk7XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY29uc3QgaW52ZXJzaWZ5XzEgPSByZXF1aXJlKFwiaW52ZXJzaWZ5XCIpO1xuY29uc3QgdHlwZXNfMSA9IHJlcXVpcmUoXCIuLi8uLi9pb2MvdHlwZXNcIik7XG5jb25zdCB0eXBlc18yID0gcmVxdWlyZShcIi4uL2FwcGxpY2F0aW9uL3R5cGVzXCIpO1xuY29uc3QgdHlwZXNfMyA9IHJlcXVpcmUoXCIuLi9wcm9jZXNzL3R5cGVzXCIpO1xuY29uc3QgbW9kdWxlSW5zdGFsbGVyXzEgPSByZXF1aXJlKFwiLi9tb2R1bGVJbnN0YWxsZXJcIik7XG5sZXQgUGlwSW5zdGFsbGVyID0gY2xhc3MgUGlwSW5zdGFsbGVyIGV4dGVuZHMgbW9kdWxlSW5zdGFsbGVyXzEuTW9kdWxlSW5zdGFsbGVyIHtcbiAgICBjb25zdHJ1Y3RvcihzZXJ2aWNlQ29udGFpbmVyKSB7XG4gICAgICAgIHN1cGVyKHNlcnZpY2VDb250YWluZXIpO1xuICAgIH1cbiAgICBnZXQgZGlzcGxheU5hbWUoKSB7XG4gICAgICAgIHJldHVybiAnUGlwJztcbiAgICB9XG4gICAgZ2V0IHByaW9yaXR5KCkge1xuICAgICAgICByZXR1cm4gMDtcbiAgICB9XG4gICAgaXNTdXBwb3J0ZWQocmVzb3VyY2UpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaXNQaXBBdmFpbGFibGUocmVzb3VyY2UpO1xuICAgIH1cbiAgICBnZXRFeGVjdXRpb25JbmZvKG1vZHVsZU5hbWUsIHJlc291cmNlKSB7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgICAgICBjb25zdCBwcm94eUFyZ3MgPSBbXTtcbiAgICAgICAgICAgIGNvbnN0IHdvcmtzcGFjZVNlcnZpY2UgPSB0aGlzLnNlcnZpY2VDb250YWluZXIuZ2V0KHR5cGVzXzIuSVdvcmtzcGFjZVNlcnZpY2UpO1xuICAgICAgICAgICAgY29uc3QgcHJveHkgPSB3b3Jrc3BhY2VTZXJ2aWNlLmdldENvbmZpZ3VyYXRpb24oJ2h0dHAnKS5nZXQoJ3Byb3h5JywgJycpO1xuICAgICAgICAgICAgaWYgKHByb3h5Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICBwcm94eUFyZ3MucHVzaCgnLS1wcm94eScpO1xuICAgICAgICAgICAgICAgIHByb3h5QXJncy5wdXNoKHByb3h5KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgYXJnczogWy4uLnByb3h5QXJncywgJ2luc3RhbGwnLCAnLVUnLCBtb2R1bGVOYW1lXSxcbiAgICAgICAgICAgICAgICBtb2R1bGVOYW1lOiAncGlwJ1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGlzUGlwQXZhaWxhYmxlKHJlc291cmNlKSB7XG4gICAgICAgIGNvbnN0IHB5dGhvbkV4ZWN1dGlvbkZhY3RvcnkgPSB0aGlzLnNlcnZpY2VDb250YWluZXIuZ2V0KHR5cGVzXzMuSVB5dGhvbkV4ZWN1dGlvbkZhY3RvcnkpO1xuICAgICAgICByZXR1cm4gcHl0aG9uRXhlY3V0aW9uRmFjdG9yeS5jcmVhdGUoeyByZXNvdXJjZSB9KVxuICAgICAgICAgICAgLnRoZW4ocHJvYyA9PiBwcm9jLmlzTW9kdWxlSW5zdGFsbGVkKCdwaXAnKSlcbiAgICAgICAgICAgIC5jYXRjaCgoKSA9PiBmYWxzZSk7XG4gICAgfVxufTtcblBpcEluc3RhbGxlciA9IF9fZGVjb3JhdGUoW1xuICAgIGludmVyc2lmeV8xLmluamVjdGFibGUoKSxcbiAgICBfX3BhcmFtKDAsIGludmVyc2lmeV8xLmluamVjdCh0eXBlc18xLklTZXJ2aWNlQ29udGFpbmVyKSlcbl0sIFBpcEluc3RhbGxlcik7XG5leHBvcnRzLlBpcEluc3RhbGxlciA9IFBpcEluc3RhbGxlcjtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXBpcEluc3RhbGxlci5qcy5tYXAiXX0=