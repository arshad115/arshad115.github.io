You may be familiar with the [onUpgrade(SQLiteDatabase, int, int)](https://developer.android.com/reference/android/database/sqlite/SQLiteOpenHelper.html#onUpgrade(android.database.sqlite.SQLiteDatabase, int, int)) method of the [SQLiteOpenHelper](https://developer.android.com/reference/android/database/sqlite/SQLiteOpenHelper.html) class, which is called in your database helper class whenever your database version changes to a higher version.

It is a good practice to upgrade your sqlite database in the following manner:

```java
@Override
public void onUpgrade(SQLiteDatabase db, int oldVersion, int newVersion) {
```

```java
switch(oldVersion) {
```

```java
    case 1:
        //upgrade logic from version 1 to 2
    case 2:
        //upgrade logic from version 2 to 3
    case 3:
        //upgrade logic from version 3 to 4
        break;
	}
}
```
The new version of the database specified in the constructor of the Database helper class every time you want to make changes to the database.

```
public DbManager(Context context) {
   super(context, DatabaseName, null, version);
   // TODO Auto-generated constructor stub
}
```

**Here comes the tip:**

To avoid changing the database version every single time, you can have a static variable with the Build Version Code.

`private static int version = BuildConfig.VERSION_CODE;`

The Android build system provides the build version of your current app in this system variable BuildConfig.VERSION_CODE. Build version is the version code you set in your AndroidManifest.xml file or Module Gradle file in Android Studio.

This way with each new build your onUpgrade method will be called.

**P.S** Make sure you update your onUpgrade logic to support all of your android app build versions.