"use strict"; // Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

Object.defineProperty(exports, "__esModule", {
  value: true
}); // tslint:disable-next-line:no-reference
/// <reference path="./vscode-extension-telemetry.d.ts" />

const vscode_1 = require("vscode");

const constants_1 = require("../common/constants");

const stopWatch_1 = require("../common/utils/stopWatch");

let telemetryReporter;

function getTelemetryReporter() {
  if (telemetryReporter) {
    return telemetryReporter;
  }

  const extensionId = constants_1.PVSC_EXTENSION_ID; // tslint:disable-next-line:no-non-null-assertion

  const extension = vscode_1.extensions.getExtension(extensionId); // tslint:disable-next-line:no-unsafe-any

  const extensionVersion = extension.packageJSON.version; // tslint:disable-next-line:no-unsafe-any

  const aiKey = extension.packageJSON.contributes.debuggers[0].aiKey; // tslint:disable-next-line:no-require-imports

  const reporter = require('vscode-extension-telemetry').default;

  return telemetryReporter = new reporter(extensionId, extensionVersion, aiKey);
}

function sendTelemetryEvent(eventName, durationMs, properties) {
  if (constants_1.isTestExecution()) {
    return;
  }

  const reporter = getTelemetryReporter();
  const measures = typeof durationMs === 'number' ? {
    duration: durationMs
  } : durationMs ? durationMs : undefined; // tslint:disable-next-line:no-any

  const customProperties = {};

  if (properties) {
    // tslint:disable-next-line:prefer-type-cast no-any
    const data = properties;
    Object.getOwnPropertyNames(data).forEach(prop => {
      if (data[prop] === undefined || data[prop] === null) {
        return;
      } // tslint:disable-next-line:prefer-type-cast no-any  no-unsafe-any


      customProperties[prop] = typeof data[prop] === 'string' ? data[prop] : data[prop].toString();
    });
  }

  reporter.sendTelemetryEvent(eventName, properties ? customProperties : undefined, measures);
}

exports.sendTelemetryEvent = sendTelemetryEvent; // tslint:disable-next-line:no-any function-name

function captureTelemetry(eventName, properties, captureDuration = true) {
  // tslint:disable-next-line:no-function-expression no-any
  return function (target, propertyKey, descriptor) {
    const originalMethod = descriptor.value; // tslint:disable-next-line:no-function-expression no-any

    descriptor.value = function (...args) {
      if (!captureDuration) {
        sendTelemetryEvent(eventName, undefined, properties); // tslint:disable-next-line:no-invalid-this

        return originalMethod.apply(this, args);
      }

      const stopWatch = new stopWatch_1.StopWatch(); // tslint:disable-next-line:no-invalid-this no-use-before-declare no-unsafe-any

      const result = originalMethod.apply(this, args); // If method being wrapped returns a promise then wait for it.
      // tslint:disable-next-line:no-unsafe-any

      if (result && typeof result.then === 'function' && typeof result.catch === 'function') {
        // tslint:disable-next-line:prefer-type-cast
        result.then(data => {
          sendTelemetryEvent(eventName, stopWatch.elapsedTime, properties);
          return data;
        }) // tslint:disable-next-line:promise-function-async
        .catch(ex => {
          // tslint:disable-next-line:no-any
          sendTelemetryEvent(eventName, stopWatch.elapsedTime, properties);
          return Promise.reject(ex);
        });
      } else {
        sendTelemetryEvent(eventName, stopWatch.elapsedTime, properties);
      }

      return result;
    };

    return descriptor;
  };
}

exports.captureTelemetry = captureTelemetry; // tslint:disable-next-line:no-any function-name

function sendTelemetryWhenDone(eventName, promise, stopWatch, properties) {
  stopWatch = stopWatch ? stopWatch : new stopWatch_1.StopWatch();

  if (typeof promise.then === 'function') {
    // tslint:disable-next-line:prefer-type-cast no-any
    promise.then(data => {
      // tslint:disable-next-line:no-non-null-assertion
      sendTelemetryEvent(eventName, stopWatch.elapsedTime, properties);
      return data; // tslint:disable-next-line:promise-function-async
    }, ex => {
      // tslint:disable-next-line:no-non-null-assertion
      sendTelemetryEvent(eventName, stopWatch.elapsedTime, properties);
      return Promise.reject(ex);
    });
  } else {
    throw new Error('Method is neither a Promise nor a Theneable');
  }
}

exports.sendTelemetryWhenDone = sendTelemetryWhenDone;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmpzIl0sIm5hbWVzIjpbIk9iamVjdCIsImRlZmluZVByb3BlcnR5IiwiZXhwb3J0cyIsInZhbHVlIiwidnNjb2RlXzEiLCJyZXF1aXJlIiwiY29uc3RhbnRzXzEiLCJzdG9wV2F0Y2hfMSIsInRlbGVtZXRyeVJlcG9ydGVyIiwiZ2V0VGVsZW1ldHJ5UmVwb3J0ZXIiLCJleHRlbnNpb25JZCIsIlBWU0NfRVhURU5TSU9OX0lEIiwiZXh0ZW5zaW9uIiwiZXh0ZW5zaW9ucyIsImdldEV4dGVuc2lvbiIsImV4dGVuc2lvblZlcnNpb24iLCJwYWNrYWdlSlNPTiIsInZlcnNpb24iLCJhaUtleSIsImNvbnRyaWJ1dGVzIiwiZGVidWdnZXJzIiwicmVwb3J0ZXIiLCJkZWZhdWx0Iiwic2VuZFRlbGVtZXRyeUV2ZW50IiwiZXZlbnROYW1lIiwiZHVyYXRpb25NcyIsInByb3BlcnRpZXMiLCJpc1Rlc3RFeGVjdXRpb24iLCJtZWFzdXJlcyIsImR1cmF0aW9uIiwidW5kZWZpbmVkIiwiY3VzdG9tUHJvcGVydGllcyIsImRhdGEiLCJnZXRPd25Qcm9wZXJ0eU5hbWVzIiwiZm9yRWFjaCIsInByb3AiLCJ0b1N0cmluZyIsImNhcHR1cmVUZWxlbWV0cnkiLCJjYXB0dXJlRHVyYXRpb24iLCJ0YXJnZXQiLCJwcm9wZXJ0eUtleSIsImRlc2NyaXB0b3IiLCJvcmlnaW5hbE1ldGhvZCIsImFyZ3MiLCJhcHBseSIsInN0b3BXYXRjaCIsIlN0b3BXYXRjaCIsInJlc3VsdCIsInRoZW4iLCJjYXRjaCIsImVsYXBzZWRUaW1lIiwiZXgiLCJQcm9taXNlIiwicmVqZWN0Iiwic2VuZFRlbGVtZXRyeVdoZW5Eb25lIiwicHJvbWlzZSIsIkVycm9yIl0sIm1hcHBpbmdzIjoiQUFBQSxhLENBQ0E7QUFDQTs7QUFDQUEsTUFBTSxDQUFDQyxjQUFQLENBQXNCQyxPQUF0QixFQUErQixZQUEvQixFQUE2QztBQUFFQyxFQUFBQSxLQUFLLEVBQUU7QUFBVCxDQUE3QyxFLENBQ0E7QUFD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QUFPLENBQUNtQyxnQkFBUixHQUEyQkEsZ0JBQTNCLEMsQ0FDQTs7QUFDQSxTQUFTaUIscUJBQVQsQ0FBK0I5QixTQUEvQixFQUEwQytCLE9BQTFDLEVBQW1EVixTQUFuRCxFQUE4RG5CLFVBQTlELEVBQTBFO0FBQ3RFbUIsRUFBQUEsU0FBUyxHQUFHQSxTQUFTLEdBQUdBLFNBQUgsR0FBZSxJQUFJdEMsV0FBVyxDQUFDdUMsU0FBaEIsRUFBcEM7O0FBQ0EsTUFBSSxPQUFPUyxPQUFPLENBQUNQLElBQWYsS0FBd0IsVUFBNUIsRUFBd0M7QUFDcEM7QUFDQU8sSUFBQUEsT0FBTyxDQUNGUCxJQURMLENBQ1VoQixJQUFJLElBQUk7QUFDZDtBQUNBVCxNQUFBQSxrQkFBa0IsQ0FBQ0MsU0FBRCxFQUFZcUIsU0FBUyxDQUFDSyxXQUF0QixFQUFtQ3hCLFVBQW5DLENBQWxCO0FBQ0EsYUFBT00sSUFBUCxDQUhjLENBSWQ7QUFDSCxLQU5ELEVBTUdtQixFQUFFLElBQUk7QUFDTDtBQUNBNUIsTUFBQUEsa0JBQWtCLENBQUNDLFNBQUQsRUFBWXFCLFNBQVMsQ0FBQ0ssV0FBdEIsRUFBbUN4QixVQUFuQyxDQUFsQjtBQUNBLGFBQU8wQixPQUFPLENBQUNDLE1BQVIsQ0FBZUYsRUFBZixDQUFQO0FBQ0gsS0FWRDtBQVdILEdBYkQsTUFjSztBQUNELFVBQU0sSUFBSUssS0FBSixDQUFVLDZDQUFWLENBQU47QUFDSDtBQUNKOztBQUNEdEQsT0FBTyxDQUFDb0QscUJBQVIsR0FBZ0NBLHFCQUFoQyIsInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO1xuLy8gQ29weXJpZ2h0IChjKSBNaWNyb3NvZnQgQ29ycG9yYXRpb24uIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4vLyBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG4vLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8tcmVmZXJlbmNlXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi92c2NvZGUtZXh0ZW5zaW9uLXRlbGVtZXRyeS5kLnRzXCIgLz5cbmNvbnN0IHZzY29kZV8xID0gcmVxdWlyZShcInZzY29kZVwiKTtcbmNvbnN0IGNvbnN0YW50c18xID0gcmVxdWlyZShcIi4uL2NvbW1vbi9jb25zdGFudHNcIik7XG5jb25zdCBzdG9wV2F0Y2hfMSA9IHJlcXVpcmUoXCIuLi9jb21tb24vdXRpbHMvc3RvcFdhdGNoXCIpO1xubGV0IHRlbGVtZXRyeVJlcG9ydGVyO1xuZnVuY3Rpb24gZ2V0VGVsZW1ldHJ5UmVwb3J0ZXIoKSB7XG4gICAgaWYgKHRlbGVtZXRyeVJlcG9ydGVyKSB7XG4gICAgICAgIHJldHVybiB0ZWxlbWV0cnlSZXBvcnRlcjtcbiAgICB9XG4gICAgY29uc3QgZXh0ZW5zaW9uSWQgPSBjb25zdGFudHNfMS5QVlNDX0VYVEVOU0lPTl9JRDtcbiAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8tbm9uLW51bGwtYXNzZXJ0aW9uXG4gICAgY29uc3QgZXh0ZW5zaW9uID0gdnNjb2RlXzEuZXh0ZW5zaW9ucy5nZXRFeHRlbnNpb24oZXh0ZW5zaW9uSWQpO1xuICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby11bnNhZmUtYW55XG4gICAgY29uc3QgZXh0ZW5zaW9uVmVyc2lvbiA9IGV4dGVuc2lvbi5wYWNrYWdlSlNPTi52ZXJzaW9uO1xuICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby11bnNhZmUtYW55XG4gICAgY29uc3QgYWlLZXkgPSBleHRlbnNpb24ucGFja2FnZUpTT04uY29udHJpYnV0ZXMuZGVidWdnZXJzWzBdLmFpS2V5O1xuICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1yZXF1aXJlLWltcG9ydHNcbiAgICBjb25zdCByZXBvcnRlciA9IHJlcXVpcmUoJ3ZzY29kZS1leHRlbnNpb24tdGVsZW1ldHJ5JykuZGVmYXVsdDtcbiAgICByZXR1cm4gdGVsZW1ldHJ5UmVwb3J0ZXIgPSBuZXcgcmVwb3J0ZXIoZXh0ZW5zaW9uSWQsIGV4dGVuc2lvblZlcnNpb24sIGFpS2V5KTtcbn1cbmZ1bmN0aW9uIHNlbmRUZWxlbWV0cnlFdmVudChldmVudE5hbWUsIGR1cmF0aW9uTXMsIHByb3BlcnRpZXMpIHtcbiAgICBpZiAoY29uc3RhbnRzXzEuaXNUZXN0RXhlY3V0aW9uKCkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCByZXBvcnRlciA9IGdldFRlbGVtZXRyeVJlcG9ydGVyKCk7XG4gICAgY29uc3QgbWVhc3VyZXMgPSB0eXBlb2YgZHVyYXRpb25NcyA9PT0gJ251bWJlcicgPyB7IGR1cmF0aW9uOiBkdXJhdGlvbk1zIH0gOiAoZHVyYXRpb25NcyA/IGR1cmF0aW9uTXMgOiB1bmRlZmluZWQpO1xuICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1hbnlcbiAgICBjb25zdCBjdXN0b21Qcm9wZXJ0aWVzID0ge307XG4gICAgaWYgKHByb3BlcnRpZXMpIHtcbiAgICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOnByZWZlci10eXBlLWNhc3Qgbm8tYW55XG4gICAgICAgIGNvbnN0IGRhdGEgPSBwcm9wZXJ0aWVzO1xuICAgICAgICBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhkYXRhKS5mb3JFYWNoKHByb3AgPT4ge1xuICAgICAgICAgICAgaWYgKGRhdGFbcHJvcF0gPT09IHVuZGVmaW5lZCB8fCBkYXRhW3Byb3BdID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOnByZWZlci10eXBlLWNhc3Qgbm8tYW55ICBuby11bnNhZmUtYW55XG4gICAgICAgICAgICBjdXN0b21Qcm9wZXJ0aWVzW3Byb3BdID0gdHlwZW9mIGRhdGFbcHJvcF0gPT09ICdzdHJpbmcnID8gZGF0YVtwcm9wXSA6IGRhdGFbcHJvcF0udG9TdHJpbmcoKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHJlcG9ydGVyLnNlbmRUZWxlbWV0cnlFdmVudChldmVudE5hbWUsIHByb3BlcnRpZXMgPyBjdXN0b21Qcm9wZXJ0aWVzIDogdW5kZWZpbmVkLCBtZWFzdXJlcyk7XG59XG5leHBvcnRzLnNlbmRUZWxlbWV0cnlFdmVudCA9IHNlbmRUZWxlbWV0cnlFdmVudDtcbi8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1hbnkgZnVuY3Rpb24tbmFtZVxuZnVuY3Rpb24gY2FwdHVyZVRlbGVtZXRyeShldmVudE5hbWUsIHByb3BlcnRpZXMsIGNhcHR1cmVEdXJhdGlvbiA9IHRydWUpIHtcbiAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8tZnVuY3Rpb24tZXhwcmVzc2lvbiBuby1hbnlcbiAgICByZXR1cm4gZnVuY3Rpb24gKHRhcmdldCwgcHJvcGVydHlLZXksIGRlc2NyaXB0b3IpIHtcbiAgICAgICAgY29uc3Qgb3JpZ2luYWxNZXRob2QgPSBkZXNjcmlwdG9yLnZhbHVlO1xuICAgICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8tZnVuY3Rpb24tZXhwcmVzc2lvbiBuby1hbnlcbiAgICAgICAgZGVzY3JpcHRvci52YWx1ZSA9IGZ1bmN0aW9uICguLi5hcmdzKSB7XG4gICAgICAgICAgICBpZiAoIWNhcHR1cmVEdXJhdGlvbikge1xuICAgICAgICAgICAgICAgIHNlbmRUZWxlbWV0cnlFdmVudChldmVudE5hbWUsIHVuZGVmaW5lZCwgcHJvcGVydGllcyk7XG4gICAgICAgICAgICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLWludmFsaWQtdGhpc1xuICAgICAgICAgICAgICAgIHJldHVybiBvcmlnaW5hbE1ldGhvZC5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IHN0b3BXYXRjaCA9IG5ldyBzdG9wV2F0Y2hfMS5TdG9wV2F0Y2goKTtcbiAgICAgICAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1pbnZhbGlkLXRoaXMgbm8tdXNlLWJlZm9yZS1kZWNsYXJlIG5vLXVuc2FmZS1hbnlcbiAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IG9yaWdpbmFsTWV0aG9kLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgICAgICAgICAgLy8gSWYgbWV0aG9kIGJlaW5nIHdyYXBwZWQgcmV0dXJucyBhIHByb21pc2UgdGhlbiB3YWl0IGZvciBpdC5cbiAgICAgICAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby11bnNhZmUtYW55XG4gICAgICAgICAgICBpZiAocmVzdWx0ICYmIHR5cGVvZiByZXN1bHQudGhlbiA9PT0gJ2Z1bmN0aW9uJyAmJiB0eXBlb2YgcmVzdWx0LmNhdGNoID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOnByZWZlci10eXBlLWNhc3RcbiAgICAgICAgICAgICAgICByZXN1bHRcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4oZGF0YSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHNlbmRUZWxlbWV0cnlFdmVudChldmVudE5hbWUsIHN0b3BXYXRjaC5lbGFwc2VkVGltZSwgcHJvcGVydGllcyk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpwcm9taXNlLWZ1bmN0aW9uLWFzeW5jXG4gICAgICAgICAgICAgICAgICAgIC5jYXRjaChleCA9PiB7XG4gICAgICAgICAgICAgICAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1hbnlcbiAgICAgICAgICAgICAgICAgICAgc2VuZFRlbGVtZXRyeUV2ZW50KGV2ZW50TmFtZSwgc3RvcFdhdGNoLmVsYXBzZWRUaW1lLCBwcm9wZXJ0aWVzKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KGV4KTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHNlbmRUZWxlbWV0cnlFdmVudChldmVudE5hbWUsIHN0b3BXYXRjaC5lbGFwc2VkVGltZSwgcHJvcGVydGllcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gZGVzY3JpcHRvcjtcbiAgICB9O1xufVxuZXhwb3J0cy5jYXB0dXJlVGVsZW1ldHJ5ID0gY2FwdHVyZVRlbGVtZXRyeTtcbi8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1hbnkgZnVuY3Rpb24tbmFtZVxuZnVuY3Rpb24gc2VuZFRlbGVtZXRyeVdoZW5Eb25lKGV2ZW50TmFtZSwgcHJvbWlzZSwgc3RvcFdhdGNoLCBwcm9wZXJ0aWVzKSB7XG4gICAgc3RvcFdhdGNoID0gc3RvcFdhdGNoID8gc3RvcFdhdGNoIDogbmV3IHN0b3BXYXRjaF8xLlN0b3BXYXRjaCgpO1xuICAgIGlmICh0eXBlb2YgcHJvbWlzZS50aGVuID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpwcmVmZXItdHlwZS1jYXN0IG5vLWFueVxuICAgICAgICBwcm9taXNlXG4gICAgICAgICAgICAudGhlbihkYXRhID0+IHtcbiAgICAgICAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1ub24tbnVsbC1hc3NlcnRpb25cbiAgICAgICAgICAgIHNlbmRUZWxlbWV0cnlFdmVudChldmVudE5hbWUsIHN0b3BXYXRjaC5lbGFwc2VkVGltZSwgcHJvcGVydGllcyk7XG4gICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpwcm9taXNlLWZ1bmN0aW9uLWFzeW5jXG4gICAgICAgIH0sIGV4ID0+IHtcbiAgICAgICAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1ub24tbnVsbC1hc3NlcnRpb25cbiAgICAgICAgICAgIHNlbmRUZWxlbWV0cnlFdmVudChldmVudE5hbWUsIHN0b3BXYXRjaC5lbGFwc2VkVGltZSwgcHJvcGVydGllcyk7XG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoZXgpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignTWV0aG9kIGlzIG5laXRoZXIgYSBQcm9taXNlIG5vciBhIFRoZW5lYWJsZScpO1xuICAgIH1cbn1cbmV4cG9ydHMuc2VuZFRlbGVtZXRyeVdoZW5Eb25lID0gc2VuZFRlbGVtZXRyeVdoZW5Eb25lO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aW5kZXguanMubWFwIl19