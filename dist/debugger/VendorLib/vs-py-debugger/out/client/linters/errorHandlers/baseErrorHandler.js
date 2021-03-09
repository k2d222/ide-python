"use strict"; // Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

Object.defineProperty(exports, "__esModule", {
  value: true
});

const types_1 = require("../../common/types");

class BaseErrorHandler {
  constructor(product, outputChannel, serviceContainer) {
    this.product = product;
    this.outputChannel = outputChannel;
    this.serviceContainer = serviceContainer;
    this.logger = this.serviceContainer.get(types_1.ILogger);
    this.installer = this.serviceContainer.get(types_1.IInstaller);
  }

  get nextHandler() {
    return this.handler;
  }

  setNextHandler(handler) {
    this.handler = handler;
  }

}

exports.BaseErrorHandler = BaseErrorHandler;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJhc2VFcnJvckhhbmRsZXIuanMiXSwibmFtZXMiOlsiT2JqZWN0IiwiZGVmaW5lUHJvcGVydHkiLCJleHBvcnRzIiwidmFsdWUiLCJ0eXBlc18xIiwicmVxdWlyZSIsIkJhc2VFcnJvckhhbmRsZXIiLCJjb25zdHJ1Y3RvciIsInByb2R1Y3QiLCJvdXRwdXRDaGFubmVsIiwic2VydmljZUNvbnRhaW5lciIsImxvZ2dlciIsImdldCIsIklMb2dnZXIiLCJpbnN0YWxsZXIiLCJJSW5zdGFsbGVyIiwibmV4dEhhbmRsZXIiLCJoYW5kbGVyIiwic2V0TmV4dEhhbmRsZXIiXSwibWFwcGluZ3MiOiJBQUFBLGEsQ0FDQTtBQUNBOztBQUNBQSxNQUFNLENBQUNDLGNBQVAsQ0FBc0JDLE9BQXRCLEVBQStCLFlBQS9CLEVBQTZDO0FBQUVDLEVBQUFBLEtBQUssRUFBRTtBQUFULENBQTdDOztBQUNBLE1BQU1DLE9BQU8sR0FBR0MsT0FBTyxDQUFDLG9CQUFELENBQXZCOztBQUNBLE1BQU1DLGdCQUFOLENBQXVCO0FBQ25CQyxFQUFBQSxXQUFXLENBQUNDLE9BQUQsRUFBVUMsYUFBVixFQUF5QkMsZ0JBQXpCLEVBQTJDO0FBQ2xELFNBQUtGLE9BQUwsR0FBZUEsT0FBZjtBQUNBLFNBQUtDLGFBQUwsR0FBcUJBLGFBQXJCO0FBQ0EsU0FBS0MsZ0JBQUwsR0FBd0JBLGdCQUF4QjtBQUNBLFNBQUtDLE1BQUwsR0FBYyxLQUFLRCxnQkFBTCxDQUFzQkUsR0FBdEIsQ0FBMEJSLE9BQU8sQ0FBQ1MsT0FBbEMsQ0FBZDtBQUNBLFNBQUtDLFNBQUwsR0FBaUIsS0FBS0osZ0JBQUwsQ0FBc0JFLEdBQXRCLENBQTBCUixPQUFPLENBQUNXLFVBQWxDLENBQWpCO0FBQ0g7O0FBQ2MsTUFBWEMsV0FBVyxHQUFHO0FBQ2QsV0FBTyxLQUFLQyxPQUFaO0FBQ0g7O0FBQ0RDLEVBQUFBLGNBQWMsQ0FBQ0QsT0FBRCxFQUFVO0FBQ3BCLFNBQUtBLE9BQUwsR0FBZUEsT0FBZjtBQUNIOztBQWJrQjs7QUFldkJmLE9BQU8sQ0FBQ0ksZ0JBQVIsR0FBMkJBLGdCQUEzQiIsInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO1xuLy8gQ29weXJpZ2h0IChjKSBNaWNyb3NvZnQgQ29ycG9yYXRpb24uIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4vLyBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jb25zdCB0eXBlc18xID0gcmVxdWlyZShcIi4uLy4uL2NvbW1vbi90eXBlc1wiKTtcbmNsYXNzIEJhc2VFcnJvckhhbmRsZXIge1xuICAgIGNvbnN0cnVjdG9yKHByb2R1Y3QsIG91dHB1dENoYW5uZWwsIHNlcnZpY2VDb250YWluZXIpIHtcbiAgICAgICAgdGhpcy5wcm9kdWN0ID0gcHJvZHVjdDtcbiAgICAgICAgdGhpcy5vdXRwdXRDaGFubmVsID0gb3V0cHV0Q2hhbm5lbDtcbiAgICAgICAgdGhpcy5zZXJ2aWNlQ29udGFpbmVyID0gc2VydmljZUNvbnRhaW5lcjtcbiAgICAgICAgdGhpcy5sb2dnZXIgPSB0aGlzLnNlcnZpY2VDb250YWluZXIuZ2V0KHR5cGVzXzEuSUxvZ2dlcik7XG4gICAgICAgIHRoaXMuaW5zdGFsbGVyID0gdGhpcy5zZXJ2aWNlQ29udGFpbmVyLmdldCh0eXBlc18xLklJbnN0YWxsZXIpO1xuICAgIH1cbiAgICBnZXQgbmV4dEhhbmRsZXIoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmhhbmRsZXI7XG4gICAgfVxuICAgIHNldE5leHRIYW5kbGVyKGhhbmRsZXIpIHtcbiAgICAgICAgdGhpcy5oYW5kbGVyID0gaGFuZGxlcjtcbiAgICB9XG59XG5leHBvcnRzLkJhc2VFcnJvckhhbmRsZXIgPSBCYXNlRXJyb3JIYW5kbGVyO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YmFzZUVycm9ySGFuZGxlci5qcy5tYXAiXX0=