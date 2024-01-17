export interface Student {
    student_id: number;
    student_name: string;
    course: string;
    semester: number;
    
    years: Year[];
}

export interface Year {
    date_YYYY: number;

    months: Month[];
}

export interface Month {
    date_MM: number;
    date_YYYY: number;

    days: Day[];
}

export interface Day {
    date_DD: number;
    date_MM: number;
    date_YYYY: number;

    periods: Period[];
}

export interface Period{
    period_number: number;
    class: {
        class_id: number;
        class_name: string;
        teacher_name: string;
    }
    isPresent: boolean;
    timeStamp: Date;
}