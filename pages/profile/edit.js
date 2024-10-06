import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";

import {
  doc,
  getDoc,
  updateDoc,
  serverTimestamp,
  getDocs,
  query,
  collection,
  where,
  setDoc,
} from "firebase/firestore";

import { userType } from "@/constants/user-type";
import { useUserContext } from "@/services/userContext";
import { auth, firestore } from "@/services/firebase";
import { useUserStore } from "@/store/user";
import GuardedPage from "@/components/GuardedPage";
import Header from "@/components/Header";
import {
  IconCurrentLocation,
  IconMail,
  IconPhone,
  IconWorld,
} from "@tabler/icons-react";

export default function EditProfile() {
  const router = useRouter();

  const { user, changeDisplayName } = useUserContext();
  const { userStore, setUser } = useUserStore();
  const [ngos, setNgos] = useState([]);

  const { register, handleSubmit, setValue, watch } = useForm();

  useEffect(() => {
    fetchUser();
    fetchNgos();
  }, []);

  async function fetchUser() {
    const docRef = doc(firestore, "Users", auth.currentUser.email);
    const docSnap = getDoc(docRef)
      .then(async (docSnap) => {
        setValue("email", user.email ?? "");

        if (docSnap.exists()) {
          let userData = docSnap.data();

          setValue("username", userData.username ?? "");
          setValue("phone", userData.phone ?? "");
          setValue("pinCode", userData.pinCode ?? "");
          userData.type && setValue("type", userData.type ?? "");

          if (userData.type === "Volunteers") {
            setValue("volunteerNgo", userData.volunteerNgo ?? "");
          }

          if (userData.type === "NGOs") {
            setValue("ngoId", userData.ngoId ?? "");
            setValue("ngoAddress", userData.ngoAddress ?? "");
          }
        }
      })
      .catch((err) => console.error(err));
  }

  async function fetchNgos() {
    const ngoRef = collection(firestore, "Users");
    const ngosSnap = await getDocs(query(ngoRef, where("type", "==", "NGOs")));

    const ngos = [];

    ngosSnap.forEach((doc) => {
      ngos.push({ id: doc.id, ...doc.data() });
    });

    setNgos(ngos);
  }

  const onSubmit = async (data) => {
    const { email, ...rest } = data;

    await changeDisplayName(data.username);
    console.log(email);

    const docRef = doc(firestore, "Users", email);

    const user = await getDoc(docRef);

    if (!user.exists())
      await setDoc(docRef, {
        ...rest,
        lastUpdated: serverTimestamp(),
      });
    else
      await updateDoc(docRef, {
        ...rest,
        lastUpdated: serverTimestamp(),
      });

    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) return;

    setUser({ id: docSnap.id, ...docSnap.data() });

    router.push("/profile");
  };

  function EditProfileSection({ title, description, children }) {
    return (
      <div className="pb-12 border-b border-base-content border-opacity-30">
        <h2 className="text-xl font-semibold leading-7">
          {title}
        </h2>
        <p className="mt-1 text-sm leading-6 opacity-70">{description}</p>
        <div className="grid grid-cols-1 mt-10 gap-x-6 gap-y-8 sm:grid-cols-6">
          {children}
        </div>
      </div>
    );
  }

  return (
    <GuardedPage>
      <Header title="Edit Profile" />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="container px-4 pt-12 mx-auto"
      >
        <div className="space-y-12">
          <EditProfileSection
            title="Personal Information"
            description="Your personal information and details"
          >
            <div className="form-control sm:col-span-full">
              <label htmlFor="username" className="text-base-content label">
                {watch("type") === "NGOs"
                  ? "NGO Name"
                  : watch("type") === "Private Companies"
                  ? "Company Name"
                  : "Username"}
              </label>
              <input
                className="input input-bordered"
                {...register("username")}
              />
            </div>

            <div className="form-control sm:col-span-3">
              <label htmlFor="pinCode" className="text-base-content label">
                Pin Code
              </label>
              <div className="input-group">
                <span>
                  <IconCurrentLocation />
                </span>
                <input
                  className="w-full input input-bordered"
                  {...register("pinCode")}
                />
              </div>
            </div>

            <div className="form-control sm:col-span-3">
              <label htmlFor="phone" className="text-base-content label">
                Phone
              </label>
              <div className="input-group">
                <span>
                  <IconPhone />
                </span>
                <input
                  className="input input-bordered"
                  {...register("phone")}
                />
              </div>
            </div>

            <div className="form-control sm:col-span-3">
              <label htmlFor="type" className="text-base-content label">
                Type
              </label>
              <select
                className="mt-1 select select-bordered"
                {...register("type")}
              >
                {userType.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </EditProfileSection>

          {watch("type") === "Volunteers" && (
            <EditProfileSection
              title="NGO Information"
              description="Your NGO information and details"
            >
              <div className="col-span-3 form-control">
                <label
                  htmlFor="volunteerNgo"
                  className="text-base-content label"
                >
                  NGO
                </label>
                <select
                  {...register("volunteerNgo")}
                  className="mt-1 select select-bordered"
                >
                  {ngos.map((ngo) => (
                    <option value={ngo.id} key={ngo.id}>
                      {ngo.username}
                    </option>
                  ))}
                </select>
              </div>
            </EditProfileSection>
          )}

          {watch("type") === "NGOs" && (
            <EditProfileSection
              title="NGO Information"
              description="Your NGO information and details"
            >
              <div className="col-span-3 form-control">
                <label htmlFor="ngoId" className="text-base-content label">
                  Id
                </label>
                <input
                  {...register("ngoId")}
                  type="text"
                  className="input input-bordered"
                />
              </div>

              <div className="col-span-3 form-control">
                <label htmlFor="ngoPhone" className="text-base-content label">
                  Phone
                </label>
                <div className="input-group">
                  <span>
                    <IconPhone />
                  </span>
                  <input
                    {...register("ngoPhone")}
                    type="text"
                    className="w-full input input-bordered"
                  />
                </div>
              </div>

              <div className="col-span-3 form-control">
                <label htmlFor="ngoEmail" className="text-base-content label">
                  Email
                </label>
                <div className="input-group">
                  <span>
                    <IconMail />
                  </span>
                  <input
                    {...register("ngoEmail")}
                    type="email"
                    className="w-full input input-bordered"
                  />
                </div>
              </div>

              <div className="col-span-3 form-control">
                <label htmlFor="ngoWebsite" className="text-base-content label">
                  Website
                </label>
                <div className="input-group">
                  <span>
                    <IconWorld />
                  </span>
                  <input
                    {...register("ngoWebsite")}
                    type="text"
                    className="w-full input input-bordered"
                  />
                </div>
              </div>

              <div className="col-span-full form-control">
                <label htmlFor="ngoAddress" className="text-base-content label">
                  Address
                </label>
                <input
                  {...register("ngoAddress")}
                  type="text"
                  className="input input-bordered"
                />
              </div>
            </EditProfileSection>
          )}
        </div>

        <div className="flex items-center justify-end mt-6 gap-x-6">
          <button type="submit" className="btn btn-primary">
            Save
          </button>
        </div>
      </form>
    </GuardedPage>
  );
}
