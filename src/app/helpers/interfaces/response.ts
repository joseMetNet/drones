export interface ResponseData {
	//service response information
	data?: any;
	//message provided by the service
	message?:string;
	//response status
	success: boolean;
	// Counting in listing
	count?:number;
}