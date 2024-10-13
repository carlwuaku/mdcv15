import { AfterViewInit, Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { HttpClient } from '@angular/common/http';
import { PointExpression } from 'leaflet';
@Component({
  selector: 'app-ghana-map',
  templateUrl: './ghana-map.component.html',
  styleUrls: ['./ghana-map.component.scss']
})
export class GhanaMapComponent implements AfterViewInit, OnInit {
  private map!: L.Map;
  private geoJsonData: any;
  constructor(private http: HttpClient) { }

  private loadGeoJsonData() {
    this.http.get('assets/ghana_regions.json').subscribe({
      next: (data) => {
        this.geoJsonData = data;
        this.addGeoJson();
      },
      error: (error) => {
        console.error('Error loading GeoJSON data:', error);
      }
    });
  }

  ngOnInit() {
    this.loadGeoJsonData();
  }

  ngAfterViewInit() {
    this.initMap();
  }



  private initMap(): void {
    this.map = L.map('map', {
      center: [7.9465, -1.0232],
      zoom: 7,
      zoomControl: true,
      attributionControl: false,
      maxBounds: L.latLngBounds(L.latLng(4.5, -3.5), L.latLng(11.5, 1.5)),
      minZoom: 6,
      maxZoom: 10,
    });
    // this.map = L.map('map').
    // setView([7.9465, -1.0232], 7).setZoom(7, { animate: true });  // Coordinates for Ghana

    // L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    //   attribution: '© OpenStreetMap contributors'
    // }).addTo(this.map);
  }

  private addGeoJson(): void {
    if (this.map && this.geoJsonData) {
      L.geoJSON(this.geoJsonData, {
        style: (feature) => ({
          fillColor: this.getColor(feature!.properties.value),
          weight: 2,
          opacity: 1,
          color: 'white',
          fillOpacity: 0.7,

        }),
        onEachFeature: (feature, layer) => {
          layer.bindPopup(`
            <strong>${feature.properties.region}</strong><br>
            Capital: ${feature.properties.capital}<br>
            Value: ${feature.properties.value}
          `);
          this.addLabel(feature, layer);
        }

      }).addTo(this.map);
      this.map.fitBounds(L.geoJSON(this.geoJsonData).getBounds());
    }
  }

  private getColor(value: number): string {
    // Example color function, adjust as needed
    return value > 1000 ? '#0556f7' :
      value > 500 ? '#4884fa' :
        value > 200 ? '#7da7fa' :
          value > 50 ? '#abc7ff' :
            '#d9e6ff';
  }

  regionAnchors: Record<string, PointExpression> = {
    'Upper East': [20, 20],
    'Upper West': [20, 20],
    'North East': [0, 20],
    'Northern': [0, 30],
    'Savannah': [0, 20],
    'Ahafo': [30, 10],
    'Western North': [30, 20],
    'Ashanti': [30, 10],
    'Volta': [20, 20],
  }

  private addLabel(feature: any, layer: L.Layer) {
    if (feature.geometry.type === 'Polygon' || feature.geometry.type === 'MultiPolygon') {
      //for some regions we have to adjust the label position
      let _iconAnchor: PointExpression = this.regionAnchors[feature.properties.region] || [0, 0];


      const center = (layer as L.Polygon).getBounds().getCenter();
      const label = L.divIcon({
        className: 'region-label',
        html: `<div>${feature.properties.region}<br>${feature.properties.value}</div>`,
        iconSize: [100, 40],
        iconAnchor: _iconAnchor
      });
      L.marker(center, { icon: label }).addTo(this.map);
    }
  }
}
