export interface ProofImage {
    name: string; // use this as the alt text
  
    type: "collection" | "delivery";
  
    category: "signature" | "fuel" | "machine"; // use as title text?
  
    data: string  // full resolution image, could be jpg or png
  
  
  }

  export interface ProofImageResponse{
    companyId:string;
    hireId: string;
    hireMob:string;
    requestType: string;
    images: ProofImage[];
  }

