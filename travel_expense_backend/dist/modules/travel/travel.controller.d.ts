import { TravelService } from './travel.service';
import { CreateTravelRequestDto } from './dto/create-travel-request.dto';
export declare class TravelController {
    private readonly travelService;
    constructor(travelService: TravelService);
    submitTravelRequest(dto: CreateTravelRequestDto, req: any): Promise<import("./entities/travel-request.entity").TravelRequest>;
    getTravelRequests(req: any): Promise<{
        success: boolean;
        data: import("./entities/travel-request.entity").TravelRequest[];
    }>;
    getTravelRequestById(id: string, req: any): Promise<{
        success: boolean;
        data: import("./entities/travel-request.entity").TravelRequest;
    }>;
    cancelTravelRequest(id: string, req: any): Promise<{
        success: boolean;
        message: string;
        data: import("./entities/travel-request.entity").TravelRequest;
    }>;
}
