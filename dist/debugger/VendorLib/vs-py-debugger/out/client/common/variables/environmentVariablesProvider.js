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

const vscode_1 = require("vscode");

const configSettings_1 = require("../configSettings");

const constants_1 = require("../platform/constants");

const types_1 = require("../types");

const types_2 = require("./types");

let EnvironmentVariablesProvider = class EnvironmentVariablesProvider {
  constructor(envVarsService, disposableRegistry, isWidows, process) {
    this.envVarsService = envVarsService;
    this.isWidows = isWidows;
    this.process = process;
    this.cache = new Map();
    this.fileWatchers = new Map();
    this.disposables = [];
    disposableRegistry.push(this);
    this.changeEventEmitter = new vscode_1.EventEmitter();
  }

  get onDidEnvironmentVariablesChange() {
    return this.changeEventEmitter.event;
  }

  dispose() {
    this.changeEventEmitter.dispose();
    this.fileWatchers.forEach(watcher => {
      watcher.dispose();
    });
  }

  getEnvironmentVariables(resource) {
    return __awaiter(this, void 0, void 0, function* () {
      const settings = configSettings_1.PythonSettings.getInstance(resource);

      if (!this.cache.has(settings.envFile)) {
        const workspaceFolderUri = this.getWorkspaceFolderUri(resource);
        this.createFileWatcher(settings.envFile, workspaceFolderUri);
        let mergedVars = yield this.envVarsService.parseFile(settings.envFile);

        if (!mergedVars) {
          mergedVars = {};
        }

        this.envVarsService.mergeVariables(this.process.env, mergedVars);
        const pathVariable = this.isWidows ? constants_1.WINDOWS_PATH_VARIABLE_NAME : constants_1.NON_WINDOWS_PATH_VARIABLE_NAME;
        this.envVarsService.appendPath(mergedVars, this.process.env[pathVariable]);
        this.envVarsService.appendPythonPath(mergedVars, this.process.env.PYTHONPATH);
        this.cache.set(settings.envFile, mergedVars);
      }

      return this.cache.get(settings.envFile);
    });
  }

  getWorkspaceFolderUri(resource) {
    if (!resource) {
      return;
    }

    const workspaceFolder = vscode_1.workspace.getWorkspaceFolder(resource);
    return workspaceFolder ? workspaceFolder.uri : undefined;
  }

  createFileWatcher(envFile, workspaceFolderUri) {
    if (this.fileWatchers.has(envFile)) {
      return;
    }

    const envFileWatcher = vscode_1.workspace.createFileSystemWatcher(envFile);
    this.fileWatchers.set(envFile, envFileWatcher);
    this.disposables.push(envFileWatcher.onDidChange(() => this.onEnvironmentFileChanged(envFile, workspaceFolderUri)));
    this.disposables.push(envFileWatcher.onDidCreate(() => this.onEnvironmentFileChanged(envFile, workspaceFolderUri)));
    this.disposables.push(envFileWatcher.onDidDelete(() => this.onEnvironmentFileChanged(envFile, workspaceFolderUri)));
  }

  onEnvironmentFileChanged(envFile, workspaceFolderUri) {
    this.cache.delete(envFile);
    this.changeEventEmitter.fire(workspaceFolderUri);
  }

};
EnvironmentVariablesProvider = __decorate([inversify_1.injectable(), __param(0, inversify_1.inject(types_2.IEnvironmentVariablesService)), __param(1, inversify_1.inject(types_1.IDisposableRegistry)), __param(2, inversify_1.inject(types_1.IsWindows)), __param(3, inversify_1.inject(types_1.ICurrentProcess))], EnvironmentVariablesProvider);
exports.EnvironmentVariablesProvider = EnvironmentVariablesProvider;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVudmlyb25tZW50VmFyaWFibGVzUHJvdmlkZXIuanMiXSwibmFtZXMiOlsiX19kZWNvcmF0ZSIsImRlY29yYXRvcnMiLCJ0YXJnZXQiLCJrZXkiLCJkZXNjIiwiYyIsImFyZ3VtZW50cyIsImxlbmd0aCIsInIiLCJPYmplY3QiLCJnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IiLCJkIiwiUmVmbGVjdCIsImRlY29yYXRlIiwiaSIsImRlZmluZVByb3BlcnR5IiwiX19wYXJhbSIsInBhcmFtSW5kZXgiLCJkZWNvcmF0b3IiLCJfX2F3YWl0ZXIiLCJ0aGlzQXJnIiwiX2FyZ3VtZW50cyIsIlAiLCJnZW5lcmF0b3IiLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsImZ1bGZpbGxlZCIsInZhbHVlIiwic3RlcCIsIm5leHQiLCJlIiwicmVqZWN0ZWQiLCJyZXN1bHQiLCJkb25lIiwidGhlbiIsImFwcGx5IiwiZXhwb3J0cyIsImludmVyc2lmeV8xIiwicmVxdWlyZSIsInZzY29kZV8xIiwiY29uZmlnU2V0dGluZ3NfMSIsImNvbnN0YW50c18xIiwidHlwZXNfMSIsInR5cGVzXzIiLCJFbnZpcm9ubWVudFZhcmlhYmxlc1Byb3ZpZGVyIiwiY29uc3RydWN0b3IiLCJlbnZWYXJzU2VydmljZSIsImRpc3Bvc2FibGVSZWdpc3RyeSIsImlzV2lkb3dzIiwicHJvY2VzcyIsImNhY2hlIiwiTWFwIiwiZmlsZVdhdGNoZXJzIiwiZGlzcG9zYWJsZXMiLCJwdXNoIiwiY2hhbmdlRXZlbnRFbWl0dGVyIiwiRXZlbnRFbWl0dGVyIiwib25EaWRFbnZpcm9ubWVudFZhcmlhYmxlc0NoYW5nZSIsImV2ZW50IiwiZGlzcG9zZSIsImZvckVhY2giLCJ3YXRjaGVyIiwiZ2V0RW52aXJvbm1lbnRWYXJpYWJsZXMiLCJyZXNvdXJjZSIsInNldHRpbmdzIiwiUHl0aG9uU2V0dGluZ3MiLCJnZXRJbnN0YW5jZSIsImhhcyIsImVudkZpbGUiLCJ3b3Jrc3BhY2VGb2xkZXJVcmkiLCJnZXRXb3Jrc3BhY2VGb2xkZXJVcmkiLCJjcmVhdGVGaWxlV2F0Y2hlciIsIm1lcmdlZFZhcnMiLCJwYXJzZUZpbGUiLCJtZXJnZVZhcmlhYmxlcyIsImVudiIsInBhdGhWYXJpYWJsZSIsIldJTkRPV1NfUEFUSF9WQVJJQUJMRV9OQU1FIiwiTk9OX1dJTkRPV1NfUEFUSF9WQVJJQUJMRV9OQU1FIiwiYXBwZW5kUGF0aCIsImFwcGVuZFB5dGhvblBhdGgiLCJQWVRIT05QQVRIIiwic2V0IiwiZ2V0Iiwid29ya3NwYWNlRm9sZGVyIiwid29ya3NwYWNlIiwiZ2V0V29ya3NwYWNlRm9sZGVyIiwidXJpIiwidW5kZWZpbmVkIiwiZW52RmlsZVdhdGNoZXIiLCJjcmVhdGVGaWxlU3lzdGVtV2F0Y2hlciIsIm9uRGlkQ2hhbmdlIiwib25FbnZpcm9ubWVudEZpbGVDaGFuZ2VkIiwib25EaWRDcmVhdGUiLCJvbkRpZERlbGV0ZSIsImRlbGV0ZSIsImZpcmUiLCJpbmplY3RhYmxlIiwiaW5qZWN0IiwiSUVudmlyb25tZW50VmFyaWFibGVzU2VydmljZSIsIklEaXNwb3NhYmxlUmVnaXN0cnkiLCJJc1dpbmRvd3MiLCJJQ3VycmVudFByb2Nlc3MiXSwibWFwcGluZ3MiOiJBQUFBLGEsQ0FDQTtBQUNBOztBQUNBLElBQUlBLFVBQVUsR0FBSSxVQUFRLFNBQUtBLFVBQWQsSUFBNkIsVUFBVUMsVUFBVixFQUFzQkMsTUFBdEIsRUFBOEJDLEdBQTlCLEVBQW1DQyxJQUFuQyxFQUF5QztBQUNuRixNQUFJQyxDQUFDLEdBQUdDLFNBQVMsQ0FBQ0MsTUFBbEI7QUFBQSxNQUEwQkMsQ0FBQyxHQUFHSCxDQUFDLEdBQUcsQ0FBSixHQUFRSCxNQUFSLEdBQWlCRSxJQUFJLEtBQUssSUFBVCxHQUFnQkEsSUFBSSxHQUFHSyxNQUFNLENBQUNDLHdCQUFQLENBQWdDUixNQUFoQyxFQUF3Q0MsR0FBeEMsQ0FBdkIsR0FBc0VDLElBQXJIO0FBQUEsTUFBMkhPLENBQTNIO0FBQ0EsTUFBSSxPQUFPQyxPQUFQLEtBQW1CLFFBQW5CLElB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LE9BQTlCLEVBQXVDQyxrQkFBdkMsQ0FBakMsQ0FBdEI7QUFDSDs7QUFDRHVCLEVBQUFBLHdCQUF3QixDQUFDeEIsT0FBRCxFQUFVQyxrQkFBVixFQUE4QjtBQUNsRCxTQUFLbkIsS0FBTCxDQUFXNkMsTUFBWCxDQUFrQjNCLE9BQWxCO0FBQ0EsU0FBS2Isa0JBQUwsQ0FBd0J5QyxJQUF4QixDQUE2QjNCLGtCQUE3QjtBQUNIOztBQTNEaUUsQ0FBdEU7QUE2REF6Qiw0QkFBNEIsR0FBRzdDLFVBQVUsQ0FBQyxDQUN0Q3NDLFdBQVcsQ0FBQzRELFVBQVosRUFEc0MsRUFFdENsRixPQUFPLENBQUMsQ0FBRCxFQUFJc0IsV0FBVyxDQUFDNkQsTUFBWixDQUFtQnZELE9BQU8sQ0FBQ3dELDRCQUEzQixDQUFKLENBRitCLEVBR3RDcEYsT0FBTyxDQUFDLENBQUQsRUFBSXNCLFdBQVcsQ0FBQzZELE1BQVosQ0FBbUJ4RCxPQUFPLENBQUMwRCxtQkFBM0IsQ0FBSixDQUgrQixFQUd1QnJGLE9BQU8sQ0FBQyxDQUFELEVBQUlzQixXQUFXLENBQUM2RCxNQUFaLENBQW1CeEQsT0FBTyxDQUFDMkQsU0FBM0IsQ0FBSixDQUg5QixFQUl0Q3RGLE9BQU8sQ0FBQyxDQUFELEVBQUlzQixXQUFXLENBQUM2RCxNQUFaLENBQW1CeEQsT0FBTyxDQUFDNEQsZUFBM0IsQ0FBSixDQUorQixDQUFELEVBS3RDMUQsNEJBTHNDLENBQXpDO0FBTUFSLE9BQU8sQ0FBQ1EsNEJBQVIsR0FBdUNBLDRCQUF2QyIsInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO1xyXG4vLyBDb3B5cmlnaHQgKGMpIE1pY3Jvc29mdCBDb3Jwb3JhdGlvbi4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cclxuLy8gTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlLlxyXG52YXIgX19kZWNvcmF0ZSA9ICh0aGlzICYmIHRoaXMuX19kZWNvcmF0ZSkgfHwgZnVuY3Rpb24gKGRlY29yYXRvcnMsIHRhcmdldCwga2V5LCBkZXNjKSB7XHJcbiAgICB2YXIgYyA9IGFyZ3VtZW50cy5sZW5ndGgsIHIgPSBjIDwgMyA/IHRhcmdldCA6IGRlc2MgPT09IG51bGwgPyBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih0YXJnZXQsIGtleSkgOiBkZXNjLCBkO1xyXG4gICAgaWYgKHR5cGVvZiBSZWZsZWN0ID09PSBcIm9iamVjdFwiICYmIHR5cGVvZiBSZWZsZWN0LmRlY29yYXRlID09PSBcImZ1bmN0aW9uXCIpIHIgPSBSZWZsZWN0LmRlY29yYXRlKGRlY29yYXRvcnMsIHRhcmdldCwga2V5LCBkZXNjKTtcclxuICAgIGVsc2UgZm9yICh2YXIgaSA9IGRlY29yYXRvcnMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIGlmIChkID0gZGVjb3JhdG9yc1tpXSkgciA9IChjIDwgMyA/IGQocikgOiBjID4gMyA/IGQodGFyZ2V0LCBrZXksIHIpIDogZCh0YXJnZXQsIGtleSkpIHx8IHI7XHJcbiAgICByZXR1cm4gYyA+IDMgJiYgciAmJiBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBrZXksIHIpLCByO1xyXG59O1xyXG52YXIgX19wYXJhbSA9ICh0aGlzICYmIHRoaXMuX19wYXJhbSkgfHwgZnVuY3Rpb24gKHBhcmFtSW5kZXgsIGRlY29yYXRvcikge1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uICh0YXJnZXQsIGtleSkgeyBkZWNvcmF0b3IodGFyZ2V0LCBrZXksIHBhcmFtSW5kZXgpOyB9XHJcbn07XHJcbnZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xyXG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XHJcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxyXG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxyXG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZShyZXN1bHQudmFsdWUpOyB9KS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XHJcbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xyXG4gICAgfSk7XHJcbn07XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuY29uc3QgaW52ZXJzaWZ5XzEgPSByZXF1aXJlKFwiaW52ZXJzaWZ5XCIpO1xyXG5jb25zdCB2c2NvZGVfMSA9IHJlcXVpcmUoXCJ2c2NvZGVcIik7XHJcbmNvbnN0IGNvbmZpZ1NldHRpbmdzXzEgPSByZXF1aXJlKFwiLi4vY29uZmlnU2V0dGluZ3NcIik7XHJcbmNvbnN0IGNvbnN0YW50c18xID0gcmVxdWlyZShcIi4uL3BsYXRmb3JtL2NvbnN0YW50c1wiKTtcclxuY29uc3QgdHlwZXNfMSA9IHJlcXVpcmUoXCIuLi90eXBlc1wiKTtcclxuY29uc3QgdHlwZXNfMiA9IHJlcXVpcmUoXCIuL3R5cGVzXCIpO1xyXG5sZXQgRW52aXJvbm1lbnRWYXJpYWJsZXNQcm92aWRlciA9IGNsYXNzIEVudmlyb25tZW50VmFyaWFibGVzUHJvdmlkZXIge1xyXG4gICAgY29uc3RydWN0b3IoZW52VmFyc1NlcnZpY2UsIGRpc3Bvc2FibGVSZWdpc3RyeSwgaXNXaWRvd3MsIHByb2Nlc3MpIHtcclxuICAgICAgICB0aGlzLmVudlZhcnNTZXJ2aWNlID0gZW52VmFyc1NlcnZpY2U7XHJcbiAgICAgICAgdGhpcy5pc1dpZG93cyA9IGlzV2lkb3dzO1xyXG4gICAgICAgIHRoaXMucHJvY2VzcyA9IHByb2Nlc3M7XHJcbiAgICAgICAgdGhpcy5jYWNoZSA9IG5ldyBNYXAoKTtcclxuICAgICAgICB0aGlzLmZpbGVXYXRjaGVycyA9IG5ldyBNYXAoKTtcclxuICAgICAgICB0aGlzLmRpc3Bvc2FibGVzID0gW107XHJcbiAgICAgICAgZGlzcG9zYWJsZVJlZ2lzdHJ5LnB1c2godGhpcyk7XHJcbiAgICAgICAgdGhpcy5jaGFuZ2VFdmVudEVtaXR0ZXIgPSBuZXcgdnNjb2RlXzEuRXZlbnRFbWl0dGVyKCk7XHJcbiAgICB9XHJcbiAgICBnZXQgb25EaWRFbnZpcm9ubWVudFZhcmlhYmxlc0NoYW5nZSgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jaGFuZ2VFdmVudEVtaXR0ZXIuZXZlbnQ7XHJcbiAgICB9XHJcbiAgICBkaXNwb3NlKCkge1xyXG4gICAgICAgIHRoaXMuY2hhbmdlRXZlbnRFbWl0dGVyLmRpc3Bvc2UoKTtcclxuICAgICAgICB0aGlzLmZpbGVXYXRjaGVycy5mb3JFYWNoKHdhdGNoZXIgPT4ge1xyXG4gICAgICAgICAgICB3YXRjaGVyLmRpc3Bvc2UoKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIGdldEVudmlyb25tZW50VmFyaWFibGVzKHJlc291cmNlKSB7XHJcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcclxuICAgICAgICAgICAgY29uc3Qgc2V0dGluZ3MgPSBjb25maWdTZXR0aW5nc18xLlB5dGhvblNldHRpbmdzLmdldEluc3RhbmNlKHJlc291cmNlKTtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLmNhY2hlLmhhcyhzZXR0aW5ncy5lbnZGaWxlKSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgd29ya3NwYWNlRm9sZGVyVXJpID0gdGhpcy5nZXRXb3Jrc3BhY2VGb2xkZXJVcmkocmVzb3VyY2UpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jcmVhdGVGaWxlV2F0Y2hlcihzZXR0aW5ncy5lbnZGaWxlLCB3b3Jrc3BhY2VGb2xkZXJVcmkpO1xyXG4gICAgICAgICAgICAgICAgbGV0IG1lcmdlZFZhcnMgPSB5aWVsZCB0aGlzLmVudlZhcnNTZXJ2aWNlLnBhcnNlRmlsZShzZXR0aW5ncy5lbnZGaWxlKTtcclxuICAgICAgICAgICAgICAgIGlmICghbWVyZ2VkVmFycykge1xyXG4gICAgICAgICAgICAgICAgICAgIG1lcmdlZFZhcnMgPSB7fTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRoaXMuZW52VmFyc1NlcnZpY2UubWVyZ2VWYXJpYWJsZXModGhpcy5wcm9jZXNzLmVudiwgbWVyZ2VkVmFycyk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBwYXRoVmFyaWFibGUgPSB0aGlzLmlzV2lkb3dzID8gY29uc3RhbnRzXzEuV0lORE9XU19QQVRIX1ZBUklBQkxFX05BTUUgOiBjb25zdGFudHNfMS5OT05fV0lORE9XU19QQVRIX1ZBUklBQkxFX05BTUU7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmVudlZhcnNTZXJ2aWNlLmFwcGVuZFBhdGgobWVyZ2VkVmFycywgdGhpcy5wcm9jZXNzLmVudltwYXRoVmFyaWFibGVdKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZW52VmFyc1NlcnZpY2UuYXBwZW5kUHl0aG9uUGF0aChtZXJnZWRWYXJzLCB0aGlzLnByb2Nlc3MuZW52LlBZVEhPTlBBVEgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jYWNoZS5zZXQoc2V0dGluZ3MuZW52RmlsZSwgbWVyZ2VkVmFycyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2FjaGUuZ2V0KHNldHRpbmdzLmVudkZpbGUpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgZ2V0V29ya3NwYWNlRm9sZGVyVXJpKHJlc291cmNlKSB7XHJcbiAgICAgICAgaWYgKCFyZXNvdXJjZSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IHdvcmtzcGFjZUZvbGRlciA9IHZzY29kZV8xLndvcmtzcGFjZS5nZXRXb3Jrc3BhY2VGb2xkZXIocmVzb3VyY2UpO1xyXG4gICAgICAgIHJldHVybiB3b3Jrc3BhY2VGb2xkZXIgPyB3b3Jrc3BhY2VGb2xkZXIudXJpIDogdW5kZWZpbmVkO1xyXG4gICAgfVxyXG4gICAgY3JlYXRlRmlsZVdhdGNoZXIoZW52RmlsZSwgd29ya3NwYWNlRm9sZGVyVXJpKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuZmlsZVdhdGNoZXJzLmhhcyhlbnZGaWxlKSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IGVudkZpbGVXYXRjaGVyID0gdnNjb2RlXzEud29ya3NwYWNlLmNyZWF0ZUZpbGVTeXN0ZW1XYXRjaGVyKGVudkZpbGUpO1xyXG4gICAgICAgIHRoaXMuZmlsZVdhdGNoZXJzLnNldChlbnZGaWxlLCBlbnZGaWxlV2F0Y2hlcik7XHJcbiAgICAgICAgdGhpcy5kaXNwb3NhYmxlcy5wdXNoKGVudkZpbGVXYXRjaGVyLm9uRGlkQ2hhbmdlKCgpID0+IHRoaXMub25FbnZpcm9ubWVudEZpbGVDaGFuZ2VkKGVudkZpbGUsIHdvcmtzcGFjZUZvbGRlclVyaSkpKTtcclxuICAgICAgICB0aGlzLmRpc3Bvc2FibGVzLnB1c2goZW52RmlsZVdhdGNoZXIub25EaWRDcmVhdGUoKCkgPT4gdGhpcy5vbkVudmlyb25tZW50RmlsZUNoYW5nZWQoZW52RmlsZSwgd29ya3NwYWNlRm9sZGVyVXJpKSkpO1xyXG4gICAgICAgIHRoaXMuZGlzcG9zYWJsZXMucHVzaChlbnZGaWxlV2F0Y2hlci5vbkRpZERlbGV0ZSgoKSA9PiB0aGlzLm9uRW52aXJvbm1lbnRGaWxlQ2hhbmdlZChlbnZGaWxlLCB3b3Jrc3BhY2VGb2xkZXJVcmkpKSk7XHJcbiAgICB9XHJcbiAgICBvbkVudmlyb25tZW50RmlsZUNoYW5nZWQoZW52RmlsZSwgd29ya3NwYWNlRm9sZGVyVXJpKSB7XHJcbiAgICAgICAgdGhpcy5jYWNoZS5kZWxldGUoZW52RmlsZSk7XHJcbiAgICAgICAgdGhpcy5jaGFuZ2VFdmVudEVtaXR0ZXIuZmlyZSh3b3Jrc3BhY2VGb2xkZXJVcmkpO1xyXG4gICAgfVxyXG59O1xyXG5FbnZpcm9ubWVudFZhcmlhYmxlc1Byb3ZpZGVyID0gX19kZWNvcmF0ZShbXHJcbiAgICBpbnZlcnNpZnlfMS5pbmplY3RhYmxlKCksXHJcbiAgICBfX3BhcmFtKDAsIGludmVyc2lmeV8xLmluamVjdCh0eXBlc18yLklFbnZpcm9ubWVudFZhcmlhYmxlc1NlcnZpY2UpKSxcclxuICAgIF9fcGFyYW0oMSwgaW52ZXJzaWZ5XzEuaW5qZWN0KHR5cGVzXzEuSURpc3Bvc2FibGVSZWdpc3RyeSkpLCBfX3BhcmFtKDIsIGludmVyc2lmeV8xLmluamVjdCh0eXBlc18xLklzV2luZG93cykpLFxyXG4gICAgX19wYXJhbSgzLCBpbnZlcnNpZnlfMS5pbmplY3QodHlwZXNfMS5JQ3VycmVudFByb2Nlc3MpKVxyXG5dLCBFbnZpcm9ubWVudFZhcmlhYmxlc1Byb3ZpZGVyKTtcclxuZXhwb3J0cy5FbnZpcm9ubWVudFZhcmlhYmxlc1Byb3ZpZGVyID0gRW52aXJvbm1lbnRWYXJpYWJsZXNQcm92aWRlcjtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZW52aXJvbm1lbnRWYXJpYWJsZXNQcm92aWRlci5qcy5tYXAiXX0=