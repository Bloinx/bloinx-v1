import supabase from "../supabase";

const setUserData = async (user, values) => {
  console.log(values);
  try {
    const { data, error } = await supabase.from("profiles").insert([
      {
        id: user?.id,
        username: values.username,
        name: values.firstName,
        lastname: values.lastName,
        email: values.email,
        gender: values.gender,
        telephone: values.phoneNumber,
      },
    ]);
    console.log(data);

    if (error) throw error;
  } catch (e) {
    alert(e.message);
  }
};

export default setUserData;
