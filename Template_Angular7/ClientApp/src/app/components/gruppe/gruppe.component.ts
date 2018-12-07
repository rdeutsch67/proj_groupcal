import {Component, Inject, Input} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {FormBuilder} from "@angular/forms";

@Component({
  selector: "gruppe",
  templateUrl: './gruppe.component.html',
  styleUrls: ['./gruppe.component.css']
})

export class GruppeComponent {
  gruppe: Gruppe;

  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private http: HttpClient,
              @Inject('BASE_URL') private baseUrl: string) {

    // create an empty object from the Quiz interface
    this.gruppe = <Gruppe>{};

    let id = +this.activatedRoute.snapshot.params["id"];
    console.log(id);
    if (id) {
      let url = this.baseUrl + "api/gruppen/" + id;
      this.http.get<Gruppe>(url).subscribe(result => {
        this.gruppe = result;
      }, error => console.error(error));
    }
    else {
      console.log("Ungültige id: routing back to home...");
      this.router.navigate(["home"]);
    }

  }

  onEdit() {
    this.router.navigate(["gruppen/edit", this.gruppe.Id]);
  }
}
