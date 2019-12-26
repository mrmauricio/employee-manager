import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { Observable } from "rxjs";

@Injectable({
    providedIn: "root"
})
export class FormService {
    constructor(private http: HttpClient) {}

    private baseUrl: string = "http://localhost:3333";

    getCountryList(): Observable<string[]> {
        return this.http.get<string[]>(`${this.baseUrl}/countries`);
    }
}
