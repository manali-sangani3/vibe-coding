"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TravelController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const travel_service_1 = require("./travel.service");
const create_travel_request_dto_1 = require("./dto/create-travel-request.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let TravelController = class TravelController {
    travelService;
    constructor(travelService) {
        this.travelService = travelService;
    }
    async submitTravelRequest(dto, req) {
        return this.travelService.submitTravelRequest(req.user.id, dto);
    }
    async getTravelRequests(req) {
        const list = await this.travelService.getTravelRequests(req.user.id);
        return { success: true, data: list };
    }
    async getTravelRequestById(id, req) {
        const detail = await this.travelService.getTravelRequestById(req.user.id, id);
        return { success: true, data: detail };
    }
    async cancelTravelRequest(id, req) {
        const res = await this.travelService.cancelTravelRequest(req.user.id, id);
        return { success: true, message: 'Travel request cancelled successfully', data: res };
    }
};
exports.TravelController = TravelController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Submit a new employee travel request' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Travel request submitted successfully and routed to first approver' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Validation error (e.g., date checks or missing fields)' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Overlapping request conflict error' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_travel_request_dto_1.CreateTravelRequestDto, Object]),
    __metadata("design:returntype", Promise)
], TravelController.prototype, "submitTravelRequest", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get list of travel requests for the logged-in employee' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of travel requests returned successfully' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TravelController.prototype, "getTravelRequests", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get detailed travel request status, including active approval stages timeline' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Detailed request context returned successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Unauthorized resource view block' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Request not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TravelController.prototype, "getTravelRequestById", null);
__decorate([
    (0, common_1.Post)(':id/cancel'),
    (0, swagger_1.ApiOperation)({ summary: 'Cancel a pending travel request' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Travel request cancelled successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Cancellation blocked (approved or completed state)' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Request not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TravelController.prototype, "cancelTravelRequest", null);
exports.TravelController = TravelController = __decorate([
    (0, swagger_1.ApiTags)('Travel Requests'),
    (0, common_1.Controller)('travel'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [travel_service_1.TravelService])
], TravelController);
//# sourceMappingURL=travel.controller.js.map