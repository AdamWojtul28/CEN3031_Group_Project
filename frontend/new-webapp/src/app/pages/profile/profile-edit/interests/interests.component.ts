import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

interface interestGroup {
  name: string
  interests: {interest: string, selected: boolean}[]
}

@Component({
  selector: 'app-interests',
  templateUrl: './interests.component.html',
  styleUrls: ['./interests.component.css']
})
export class InterestsComponent {
  creativeInterests: interestGroup = {name: 'Creative', interests: [
    {interest: 'Art', selected: false},
    {interest: 'Acting', selected: false},
    {interest: 'Board Games', selected: false},
    {interest: 'Making Music', selected: false},
    {interest: 'Dancing', selected: false},
    {interest: 'DJing', selected: false},
    {interest: 'Drawing', selected: false},
    {interest: 'Photography', selected: false},
    {interest: 'Playing an Instrument', selected: false},
    {interest: 'Poetry', selected: false},
    {interest: 'Singing', selected: false},
    {interest: 'Standup Comedy', selected: false},
    {interest: 'Video Games', selected: false}
  ]}

  sportsInterests: interestGroup = {name: 'Sports', interests: [
    {interest: 'BackPacking', selected: false},
    {interest: 'Baseball', selected: false},
    {interest: 'Basketball', selected: false},
    {interest: 'Bodybuilding', selected: false},
    {interest: 'Canoeing', selected: false},
    {interest: 'Boating', selected: false},
    {interest: 'Bowling', selected: false},
    {interest: 'Football', selected: false},
    {interest: 'Golf', selected: false},
    {interest: 'Hiking', selected: false},
    {interest: 'Kayaking', selected: false},
    {interest: 'Martial Arts', selected: false},
    {interest: 'Mountain Biking', selected: false},
    {interest: 'Mountain Climbing', selected: false},
    {interest: 'Paintball', selected: false},
    {interest: 'Pickeball', selected: false},
    {interest: 'Pilates', selected: false},
    {interest: 'Rock Climbing', selected: false},
    {interest: 'Running', selected: false},
    {interest: 'Sailing', selected: false},
    {interest: 'Scuba Diving', selected: false},
    {interest: 'Skydiving', selected: false},
    {interest: 'Snowboarding', selected: false},
    {interest: 'Skiing', selected: false},
    {interest: 'Tennis', selected: false},
    {interest: 'Working Out', selected: false},
    {interest: 'Yoga', selected: false},
  ]}

  techInterests: interestGroup = {name: 'Technology', interests: [
    {interest: 'Artificial Intelligence', selected: false},
    {interest: 'Programming', selected: false},
    {interest: 'Robotics', selected: false},
    {interest: 'Social Media', selected: false},
    {interest: 'Virtual Reality', selected: false},
    {interest: 'Web Design', selected: false},
  ]}

  leisureInterests: interestGroup = {name: 'Leisure', interests: [
    {interest: 'Baking', selected: false},
    {interest: 'Cleaning', selected: false},
    {interest: 'Coloring', selected: false},
    {interest: 'Journaling', selected: false},
    {interest: 'Karaoke', selected: false},
    {interest: 'Listening To Music', selected: false},
    {interest: 'Meditating', selected: false},
    {interest: 'Reading', selected: false},
    {interest: 'Swimming', selected: false},
    {interest: 'Walking', selected: false},
  ]}

  miscInterests: interestGroup = {name: 'Miscellaneous', interests: [
    {interest: 'Astronomy', selected: false},
    {interest: 'Astrology', selected: false},
    {interest: 'Vintage Shopping', selected: false},
    {interest: 'Thrifting', selected: false},
    {interest: 'Car Restoration', selected: false},
  ]}

  @ViewChild('f') interestsForm!: NgForm;

  constructor() {}

  onSaveChanges() {
    console.log('saving changes');
    console.log(this.interestsForm);
  }

}
