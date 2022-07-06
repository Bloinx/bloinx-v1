import supabase from "../supabase";

const setUserData = async (user, values) => {
  console.log(values);
  try {
    const { data, error } = await supabase.from("profiles").insert([
      {
        id: user?.id,
        username: values.username,
        email: values.email,
        age: values.yearsOld,
        gender: values.gender,
      },
    ]);
    console.log(data);

    if (error) throw error;
  } catch (e) {
    alert(e.message);
  }
};

export default setUserData;
