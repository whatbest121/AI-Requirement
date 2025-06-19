# Quote Voting System Frontend

## Overview
ระบบโหวตคำคมที่พัฒนาด้วย Next.js, TypeScript, และ TanStack Query โดยเชื่อมต่อกับ API backend

## Features
- ✅ แสดงรายการคำคมจาก API
- ✅ ระบบค้นหาคำคม
- ✅ ระบบโหวตคำคม (โหวตได้ 1 ครั้งต่อคำคม)
- ✅ ยกเลิกการโหวต
- ✅ ไม่สามารถโหวตคำคมของตัวเองได้
- ✅ สร้างคำคมใหม่
- ✅ การเรียงลำดับ (ใหม่ล่าสุด, เก่าที่สุด, ยอดนิยม)
- ✅ UI ที่สวยงามและ responsive
- ✅ ระบบ Authentication และ User Management
- ✅ Header Navigation และ Logout System

## Authentication & User Management

### การดึง User ID
ระบบใช้ JWT token และ API `/users/profile` เพื่อดึงข้อมูล user:

```typescript
// ใช้ useCurrentUser hook
import { useCurrentUser } from '@/hooks/useCurrentUser';

const { userId, isAuthenticated, user } = useCurrentUser();
```

### User Data Flow
1. **Login**: เก็บ JWT token ใน localStorage
2. **Token Validation**: ตรวจสอบ token เมื่อโหลดแอป
3. **Profile Fetch**: ดึงข้อมูล user จาก `/users/profile` API
4. **User ID**: ใช้ `user._id` สำหรับการโหวตและตรวจสอบ

### Logout System
- **ปุ่ม Logout**: แสดงใน header เมื่อเข้าสู่ระบบแล้ว
- **Token Removal**: ลบ JWT token จาก localStorage
- **User Data Clear**: ล้างข้อมูล user จาก cache
- **Redirect**: กลับไปหน้าแรกหลัง logout

### API Endpoints
- `POST /auth/login` - เข้าสู่ระบบ
- `GET /users/profile` - ดึงข้อมูล user profile
- `POST /vote/{quote_id}` - โหวตคำคม
- `POST /vote/cancelVot/{quote_id}` - ยกเลิกการโหวต
- `GET /vote/has-voted/{quote_id}` - ตรวจสอบการโหวต

## Voting System

### กฎการโหวต
- **1 User = 1 โหวตต่อคำคม**: ผู้ใช้แต่ละคนสามารถโหวตได้เพียง 1 ครั้งต่อคำคม
- **ไม่โหวตคำคมตัวเอง**: ผู้ใช้ไม่สามารถโหวตคำคมของตัวเองได้
- **ยกเลิกการโหวตได้**: ผู้ใช้สามารถยกเลิกการโหวตได้
- **ต้องเข้าสู่ระบบ**: เฉพาะผู้ใช้ที่เข้าสู่ระบบเท่านั้นที่สามารถโหวตได้

### สถานะการโหวต
- **ยังไม่โหวต**: แสดงปุ่ม "โหวต" (สีเขียว)
- **โหวตแล้ว**: แสดงปุ่ม "ยกเลิกโหวต" (สีแดง, ไอคอนหัวใจ)
- **คำคมตัวเอง**: ไม่แสดงปุ่มโหวต, แสดงแบนเนอร์ "คำคมของคุณ"
- **ไม่ได้เข้าสู่ระบบ**: ไม่แสดงปุ่มโหวต

## API Integration

### Quote Services
- `useGetQuote` - ดึงรายการคำคมแบบ paginated
- `useCreateQuote` - สร้างคำคมใหม่
- `useEditQuote` - แก้ไขคำคม
- `useDeleteQuote` - ลบคำคม

### Vote Services
- `useVote` - โหวตคำคม
- `useHasVoted` - ตรวจสอบว่าโหวตแล้วหรือยัง
- `useCancelVote` - ยกเลิกการโหวต
- `useCheckVote` - ตรวจสอบสถานะการโหวต

### User Services
- `useGetProfile` - ดึงข้อมูล user profile
- `useCurrentUser` - Custom hook สำหรับจัดการ user data