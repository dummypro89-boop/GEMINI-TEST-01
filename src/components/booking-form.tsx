"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const bookingSchema = z.object({
  name: z.string().min(2, "이름을 2자 이상 입력하세요."),
  phone: z.string().min(9, "연락처를 입력하세요."),
  classType: z.string().min(1, "희망 수업을 선택하세요."),
  date: z.string().min(1, "날짜를 선택하세요."),
  time: z.string().min(1, "시간을 선택하세요.")
});

type BookingFormValues = z.infer<typeof bookingSchema>;

const classes = ["개인 레슨 (1:1)", "듀엣 레슨 (2:1)", "그룹 레슨 (4:1)", "재활/교정 프로그램"];

export function BookingForm() {
  const [submitted, setSubmitted] = useState<string>("");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      name: "",
      phone: "",
      classType: "",
      date: "",
      time: ""
    }
  });

  const onSubmit = async (values: BookingFormValues) => {
    setSubmitted(`${values.name} 님, ${values.date} ${values.time} ${values.classType} 예약이 접수되었습니다.`);
    reset();
  };

  return (
    <div className="card-surface mt-5 p-6 md:p-8">
      <h3 className="font-serif text-3xl text-sand-900">Program Reservation</h3>
      <form className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2" onSubmit={handleSubmit(onSubmit)} noValidate>
        <label className="flex flex-col gap-2 text-sm text-sand-700">
          성함
          <input className="border border-sand-200 bg-white px-3 py-2" {...register("name")} />
          {errors.name && <span className="text-xs text-red-600">{errors.name.message}</span>}
        </label>

        <label className="flex flex-col gap-2 text-sm text-sand-700">
          연락처
          <input className="border border-sand-200 bg-white px-3 py-2" {...register("phone")} />
          {errors.phone && <span className="text-xs text-red-600">{errors.phone.message}</span>}
        </label>

        <label className="flex flex-col gap-2 text-sm text-sand-700">
          희망 수업
          <select className="border border-sand-200 bg-white px-3 py-2" {...register("classType")}>
            <option value="">선택하세요</option>
            {classes.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          {errors.classType && <span className="text-xs text-red-600">{errors.classType.message}</span>}
        </label>

        <label className="flex flex-col gap-2 text-sm text-sand-700">
          날짜
          <input type="date" className="border border-sand-200 bg-white px-3 py-2" {...register("date")} />
          {errors.date && <span className="text-xs text-red-600">{errors.date.message}</span>}
        </label>

        <label className="flex flex-col gap-2 text-sm text-sand-700">
          시간
          <input type="time" className="border border-sand-200 bg-white px-3 py-2" {...register("time")} />
          {errors.time && <span className="text-xs text-red-600">{errors.time.message}</span>}
        </label>

        <div className="flex items-end">
          <button type="submit" disabled={isSubmitting} className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-70">
            {isSubmitting ? "처리중..." : "예약 등록"}
          </button>
        </div>
      </form>

      {submitted && <p className="mt-3 text-sm text-emerald-700">{submitted}</p>}
    </div>
  );
}
